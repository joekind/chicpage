/**
 * 分页切块工具 - 将过大的块拆分为更小的部分
 */

import { measureHeight } from './measurer';
import { findNaturalBreakIndex } from './utils';

/** 切块结果 */
export interface SliceResult {
  first: Node;
  rest: Node[];
}

/**
 * 尝试将块切分为两部分
 */
export async function sliceBlock(
  block: Node,
  targetH: number
): Promise<SliceResult | null> {
  if (block.nodeType !== Node.ELEMENT_NODE) return null;
  const element = block as Element;
  const tag = element.tagName.toLowerCase();

  // 支持切块的标签类型
  const textSplitable = ['p', 'li', 'blockquote'].includes(tag);
  const listSplitable = ['ul', 'ol'].includes(tag);

  if (!textSplitable && !listSplitable) return null;

  // 列表切块
  if (listSplitable) {
    return sliceList(element, targetH);
  }

  // 文本切块
  if (textSplitable) {
    return sliceTextBlock(element, targetH);
  }

  return null;
}

/**
 * 切分列表
 */
async function sliceList(
  element: Element,
  targetH: number
): Promise<SliceResult | null> {
  const items = Array.from(element.children);
  if (items.length <= 1) return null;

  // 二分查找最适合的项目数量
  let low = 0;
  let high = items.length;
  let best = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (mid === 0) {
      low = 1;
      continue;
    }

    const candidate = element.cloneNode(false) as HTMLElement;
    for (let i = 0; i < mid; i++) {
      candidate.appendChild(items[i].cloneNode(true));
    }

    const h = await measureHeight([candidate], false);
    if (h <= targetH) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (best === 0) return null;

  const first = element.cloneNode(false) as HTMLElement;
  items.slice(0, best).forEach((i) => first.appendChild(i.cloneNode(true)));

  const rest = element.cloneNode(false) as HTMLElement;
  items.slice(best).forEach((i) => rest.appendChild(i.cloneNode(true)));

  return { first, rest: [rest] };
}

/**
 * 切分文本块
 */
async function sliceTextBlock(
  element: Element,
  targetH: number
): Promise<SliceResult | null> {
  const sourceText = (element.textContent || '').trim();
  if (sourceText.length < 10) return null;

  const createNodeFromText = (text: string): Node => {
    const clone = element.cloneNode(false) as HTMLElement;
    clone.textContent = text;
    return clone;
  };

  // 二分查找最适合的文本长度
  let low = 1;
  let high = sourceText.length;
  let best = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const cand = createNodeFromText(sourceText.slice(0, mid));
    const h = await measureHeight([cand], false);

    if (h <= targetH) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (best < 5) return null;

  // 在自然断句处切分
  const splitAt = findNaturalBreakIndex(sourceText, best);
  const firstText = sourceText.slice(0, splitAt).trim();
  const restText = sourceText.slice(splitAt).trim();

  if (!firstText || !restText) return null;

  return {
    first: createNodeFromText(firstText),
    rest: [createNodeFromText(restText)],
  };
}
