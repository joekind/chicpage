import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import hljs from 'highlight.js';
import type { Node, Parent } from 'unist';
import type { Element, Root } from 'hast';
import { getLocalImage } from './image_service';

interface ImageNode extends Node {
  type: "image";
  url?: string;
}

interface DirectiveData {
  hName?: string;
  hProperties?: Record<string, unknown>;
}

interface DirectiveNode extends Node {
  type: "textDirective" | "leafDirective" | "containerDirective" | string;
  data?: DirectiveData;
  name?: string;
  attributes?: Record<string, unknown>;
}

/**
 * remark plugin: Resolves local images using 'img://' protocol from IndexedDB
 */
function remarkLocalImageResolver() {
  return async (tree: Node) => {
    const images: ImageNode[] = [];
    visit(tree, 'image', (node) => {
      const imageNode = node as ImageNode;
      if (imageNode.url && imageNode.url.startsWith('img://')) {
        images.push(imageNode);
      }
    });

    if (images.length === 0) return;

    // 并行获取所有本地图片数据
    await Promise.all(images.map(async (node) => {
      const data = await getLocalImage(node.url ?? "");
      if (data) {
        node.url = data;
      }
    }));
  };
}

function remarkDirectivePlugin() {
  const STYLES: Record<string, { bg: string; border: string; color: string }> = {
    tip:     { bg: '#eff6ff', border: '#3b82f6', color: '#1e40af' },
    note:    { bg: '#eff6ff', border: '#3b82f6', color: '#1e40af' },
    warning: { bg: '#fff7ed', border: '#f97316', color: '#9a3412' },
    caution: { bg: '#fff7ed', border: '#f97316', color: '#9a3412' },
    danger:  { bg: '#fef2f2', border: '#ef4444', color: '#991b1b' },
  };

  return (tree: Node) => {
    visit(tree, (node) => {
      const directiveNode = node as DirectiveNode;
      if (
        directiveNode.type === 'textDirective' ||
        directiveNode.type === 'leafDirective' ||
        directiveNode.type === 'containerDirective'
      ) {
        const data = directiveNode.data || (directiveNode.data = {});
        const name = directiveNode.name as string;
        const s = STYLES[name];
        if (s) {
          data.hName = 'div';
          data.hProperties = {
            style: `display:block;margin:1.2em 0;padding:12px 16px;background:${s.bg};border-left:4px solid ${s.border};border-radius:0 6px 6px 0;color:${s.color};font-size:14px;`,
          };
        } else {
          data.hName = directiveNode.name;
          data.hProperties = directiveNode.attributes || {};
        }
      }
    });
  };
}

function rehypeHighlightedCodeBlock() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || index == null || !parent) return;
      if (parent.type !== 'root' && parent.type !== 'element') return;

      const preElement = node as Element;
      const codeNode = preElement.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code'
      );
      if (!codeNode) return;

      const classNames = ((codeNode?.properties?.className as string[]) ?? []);
      const langClass = classNames.find((c) => c.startsWith('language-'));

      const rawText = codeNode?.children
        .map((child) => {
          if (child.type === 'text') return child.value;
          if (child.type === 'raw') return child.value;
          return '';
        })
        .join('') ?? '';

      const highlighted = highlightCode(rawText, langClass?.replace('language-', ''));

      codeNode.children = [{ type: 'raw', value: highlighted }];
      codeNode.properties = {
        ...codeNode.properties,
        className: [...classNames, 'hljs'],
        style: [
          'display:block',
          'overflow-x:auto',
          'overflow-y:hidden',
          'padding:0',
          'border-radius:0',
          'background:transparent',
          'font-size:inherit',
          'line-height:inherit',
          'font-family:inherit',
        ].join(';'),
      };

      preElement.properties = {
        ...(preElement.properties ?? {}),
        style: [
          'margin:1.2em 0',
          'border-radius:10px',
          'overflow:auto',
          'max-height:50vh',
          'max-height:50dvh',
          'background:#f8fafc',
          'border:1px solid #e5e7eb',
        ].join(';'),
      };

      (parent as Parent).children[index] = preElement as Node;
    });
  };
}

function highlightCode(raw: string, language?: string): string {
  try {
    const normalizedLanguage = language?.toLowerCase();
    if (normalizedLanguage && hljs.getLanguage(normalizedLanguage)) {
      return hljs.highlight(raw, { language: normalizedLanguage }).value;
    }
    return hljs.highlightAuto(raw).value;
  } catch {
    return raw;
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  // 专用分页标记：将 <!--pagebreak--> 转成可识别的分页节点
  const normalizedMarkdown = markdown.replace(
    /<!--\s*pagebreak\s*-->/gi,
    "\n<hr data-pagebreak=\"true\" />\n",
  );

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkLocalImageResolver)
    .use(remarkDirective)
    .use(remarkDirectivePlugin)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlightedCodeBlock)
    .use(rehypeStringify)
    .process(normalizedMarkdown);

  return result.toString();
}
