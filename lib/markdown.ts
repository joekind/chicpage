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

/**
 * remark plugin: Resolves reference-style images by looking up their ID 
 * in the provided references string.
 */
/**
 * remark plugin: Aggressively resolves reference-style image text.
 * It scans all text nodes for the ![alt][id] pattern and manually converts them to images.
 * This bypasses strict markdown parsing rules that often fail with special characters.
 */
function remarkImageResolver(references: string) {
  return (tree: Node) => {
    // 1. Build a robust ID -> URL map
    const refMap: Record<string, string> = {};
    // Extract any [img_xxx]: url pattern from references
    const lines = references.split('\n');
    lines.forEach(line => {
      const match = line.match(/\[(img_[a-z0-9]+)\]:\s*([^\s|]+)/);
      if (match) {
        refMap[match[1]] = match[2];
      }
    });

    // 2. Visit all nodes and manually transform text that looks like an image tag
    visit(tree, (node: any, index, parent: any) => {
      if (node.type === 'text' && parent && typeof index === 'number') {
        const regex = /!\[([^\]]*)\]\[(img_[a-z0-9]+)\]/g;
        let lastIndex = 0;
        const children = [];
        let match;

        while ((match = regex.exec(node.value)) !== null) {
          const [, alt, id] = match;
          const url = refMap[id];

          if (url) {
            // Push text before the match
            if (match.index > lastIndex) {
              children.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
            }

            // Push the new image node
            children.push({
              type: 'image',
              url: url,
              alt: alt,
              title: null
            });

            lastIndex = regex.lastIndex;
          }
        }

        // Push remaining text
        if (lastIndex < node.value.length && lastIndex > 0) {
          children.push({ type: 'text', value: node.value.slice(lastIndex) });
        }

        // If we found any matches, replace the single text node with our new sequence
        if (children.length > 0) {
          parent.children.splice(index, 1, ...children);
          return index + children.length;
        }
      }
      
      // Also handle cases where remark-parse DID identify it as an image/imageReference
      if ((node.type === 'image' || node.type === 'imageReference') && (node.url || node.identifier)) {
        const id = node.url || node.identifier;
        if (id && id.startsWith('img_')) {
          const url = refMap[id];
          if (url) {
            node.type = 'image';
            node.url = url;
            delete node.identifier;
            delete node.referenceType;
          }
        }
      }
    });
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
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const data: any = node.data || ((node as any).data = {});
        const name = (node as any).name as string;
        const s = STYLES[name];
        if (s) {
          // 转成 <div> 并带 inline style，公众号可以识别
          data.hName = 'div';
          data.hProperties = {
            style: `display:block;margin:1.2em 0;padding:12px 16px;background:${s.bg};border-left:4px solid ${s.border};border-radius:0 6px 6px 0;color:${s.color};font-size:14px;`,
          };
        } else {
          data.hName = (node as any).name;
          data.hProperties = (node as any).attributes || {};
        }
      }
    });
  };
}

/**
 * rehype plugin: walks code blocks and applies highlight.js inline styles.
 * This ensures colors survive when pasting into WeChat / other platforms.
 */
function rehypeInlineHighlight() {
  return (tree: Root) => {
    visit(tree, 'element', (node, _index, parent) => {
      // Target <code> inside <pre>
      if (
        node.tagName === 'code' &&
        (parent as Parent | undefined)?.type === 'element' &&
        (parent as Element).tagName === 'pre'
      ) {
        const classNames: string[] = (node.properties?.className as string[]) ?? [];
        const langClass = classNames.find((c) => c.startsWith('language-'));
        const lang = langClass?.replace('language-', '');

        // Get raw text content
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

        // Replace children with raw HTML — rehypeRaw will parse it
        node.children = [{ type: 'raw', value: highlighted }];

        // Apply container styles inline so they survive copy-paste
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

        // Also style the parent <pre>
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

export async function markdownToHtml(markdown: string, references: string = ''): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkImageResolver, references)
    .use(remarkDirective)
    .use(remarkDirectivePlugin)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeInlineHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
