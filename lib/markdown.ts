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

function rehypeInlineHighlight() {
  return (tree: Root) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (
        node.tagName === 'code' &&
        (parent as Parent | undefined)?.type === 'element' &&
        (parent as Element).tagName === 'pre'
      ) {
        const classNames: string[] = (node.properties?.className as string[]) ?? [];
        const langClass = classNames.find((c) => c.startsWith('language-'));
        const lang = langClass?.replace('language-', '');

        const raw = node.children
          .filter((c): c is { type: 'text'; value: string } => c.type === 'text')
          .map((c) => c.value)
          .join('');

        let highlighted: string;
        try {
          highlighted = lang && hljs.getLanguage(lang)
            ? hljs.highlight(raw, { language: lang }).value
            : hljs.highlightAuto(raw).value;
        } catch {
          highlighted = raw;
        }

        node.children = [{ type: 'raw', value: highlighted }];

        node.properties = {
          ...node.properties,
          style: [
            'display:block',
            'overflow-x:auto',
            'padding:1em',
            'background:#1e1e1e',
            'color:#d4d4d4',
            'border-radius:6px',
            'font-size:13px',
            'line-height:1.6',
            'font-family:Consolas,"Courier New",monospace',
          ].join(';'),
        };

        if (parent && (parent as Element).tagName) {
          (parent as Element).properties = {
            ...(parent as Element).properties,
            style: 'margin:1.2em 0;border-radius:8px;overflow:hidden;',
          };
        }
      }
    });
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkLocalImageResolver)
    .use(remarkDirective)
    .use(remarkDirectivePlugin)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeInlineHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
