/**
 * 编辑器命令的纯逻辑层。
 *
 * 这里集中维护「内容模板」与「文本变换」等不依赖 React 的逻辑，作为桌面端与
 * 移动端共享的唯一来源（single source of truth），避免两端各写一份导致行为漂移。
 */

/** 样式模式：公众号排版 / 贴图（小红书）排版 */
export type StyleTheme = 'wechat' | 'poster';

/** 匹配 Markdown 图片语法，捕获 alt 与 url（兼容可选 title） */
export const MARKDOWN_IMAGE_RE = /!\[([^\]\n]*)\]\((\S+?)(?:\s+(["'])(.*?)\3)?\)/g;

/** 贴图模式下的内容片段，桌面端与移动端统一使用，保证插入结果一致 */
export const POSTER_SNIPPETS = {
  /** H1：主标题 */
  headingPrimary: `\n✨ 在这里输入标题 ✨\n${'━'.repeat(12)}\n`,
  /** H2：小标题 */
  headingSecondary: '\n📍 ',
  /** 加粗：用书名号包裹 */
  bold: { before: '「', after: '」' },
  /** 引用 */
  quote: '\n✦ ',
  /** 装饰分隔线 */
  separator: `\n${'━'.repeat(15)}\n`,
} as const;

/** 强制分页符 */
export const PAGE_BREAK_SNIPPET = '\n\n<!--pagebreak-->\n\n';

/** 代码块占位片段 */
export const CODE_BLOCK_SNIPPET = '\n```js\n\n```\n';

/** 表格行 / 列的取值范围 */
export const MIN_TABLE_SIZE = 1;
export const MAX_TABLE_SIZE = 10;

/** 图片宽度（百分比）的取值范围 */
export const IMAGE_WIDTH_MIN = 40;
export const IMAGE_WIDTH_MAX = 100;

/** 中日韩统一表意文字基本区，用于中英文混排判断 */
const CJK_RANGE = '一-龥';
const PANGU_CJK_BEFORE_ALNUM = new RegExp(`([${CJK_RANGE}])([a-zA-Z0-9])`, 'g');
const PANGU_ALNUM_BEFORE_CJK = new RegExp(`([a-zA-Z0-9])([${CJK_RANGE}])`, 'g');

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * 生成 Markdown 表格文本，行列均做 1~MAX_TABLE_SIZE 归一化。
 */
export function buildTableMarkdown(rows: number, cols: number) {
  const normalizedRows = clamp(Math.round(rows), MIN_TABLE_SIZE, MAX_TABLE_SIZE);
  const normalizedCols = clamp(Math.round(cols), MIN_TABLE_SIZE, MAX_TABLE_SIZE);
  const header = '| ' + Array(normalizedCols).fill('标题').join(' | ') + ' |';
  const divider = '| ' + Array(normalizedCols).fill('---').join(' | ') + ' |';
  const row = '| ' + Array(normalizedCols).fill('内容').join(' | ') + ' |';

  return '\n' + [header, divider, ...Array(normalizedRows).fill(row)].join('\n') + '\n';
}

/**
 * 中英文（及数字）之间补空格，即「盘古之白」。
 */
export function applyPanguSpacing(text: string) {
  return text.replace(PANGU_CJK_BEFORE_ALNUM, '$1 $2').replace(PANGU_ALNUM_BEFORE_CJK, '$1 $2');
}

/**
 * 清除一段文本中的行内 Markdown / HTML 格式标记，返回纯文本。
 * 当文本没有可清除的格式（结果与原文相同）时返回 `null`。
 */
export function clearInlineFormatting(text: string): string | null {
  const cleaned = text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<mark\b[^>]*>([\s\S]*?)<\/mark>/gi, '$1')
    .replace(/<(kbd|sup|sub)>([\s\S]*?)<\/\1>/gi, '$2');

  return cleaned === text ? null : cleaned;
}

/**
 * 将第 `imageIndex` 张图片的宽度写入其 Markdown title（`"width=NN%"`）。
 * 宽度做 IMAGE_WIDTH_MIN~IMAGE_WIDTH_MAX 归一化；无任何变化时返回 `null`。
 */
export function replaceImageWidth(
  markdown: string,
  imageIndex: number,
  widthPercent: number,
): string | null {
  const normalizedWidth = clamp(Math.round(widthPercent), IMAGE_WIDTH_MIN, IMAGE_WIDTH_MAX);
  let currentImageIndex = -1;
  const next = markdown.replace(MARKDOWN_IMAGE_RE, (match, alt: string, url: string) => {
    currentImageIndex += 1;
    if (currentImageIndex !== imageIndex) return match;
    return `![${alt}](${url} "width=${normalizedWidth}%")`;
  });

  return next === markdown ? null : next;
}
