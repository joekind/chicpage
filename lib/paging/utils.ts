/**
 * 分页工具函数
 */

import { REGEX } from '@/config/constants';

/**
 * 将 markdown 中的分页标记转换为 HTML hr 标签
 */
export function normalizePageBreaks(markdown: string): string {
  return markdown.replace(REGEX.PAGEBREAK, '\n<hr data-pagebreak="true" />\n');
}

/**
 * 解析 HTML，按分页标记拆分为章节
 */
export function parseSections(html: string): Node[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const sections: Node[][] = [];
  let currentSection: Node[] = [];

  Array.from(doc.body.childNodes).forEach((node) => {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).tagName.toLowerCase() === 'hr' &&
      (node as Element).hasAttribute('data-pagebreak')
    ) {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
      return;
    }

    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) {
      return;
    }

    currentSection.push(node.cloneNode(true));
  });

  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * 节点转 HTML
 */
export function nodesToHtml(nodes: Node[]): string {
  const wrapper = document.createElement('div');
  nodes.forEach((n) => wrapper.appendChild(n.cloneNode(true)));
  return wrapper.innerHTML;
}

/**
 * 检查节点是否包含图片
 */
export function hasImage(node: Node): boolean {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    ((node as Element).tagName.toLowerCase() === 'img' ||
      Boolean((node as Element).querySelector('img')))
  );
}

/**
 * 在文本中查找自然的断句位置
 */
export function findNaturalBreakIndex(text: string, preferred: number): number {
  const min = Math.max(0, Math.floor(preferred * 0.55));
  const range = text.slice(min, preferred);
  const matches = Array.from(range.matchAll(/[。！？.!?；;，,\n]/g));
  if (matches.length === 0) return preferred;
  const last = matches[matches.length - 1];
  return min + (last.index ?? 0) + 1;
}

/**
 * 等待元素中的图片加载完成
 */
export function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 2000);
        }),
    ),
  ).then(() => undefined);
}

/**
 * 预加载图片列表
 */
export function preloadImages(srcs: string[]): Promise<void> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
          if (image.complete) resolve();
          setTimeout(resolve, 2500);
        }),
    ),
  ).then(() => undefined);
}
