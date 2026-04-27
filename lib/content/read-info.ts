/**
 * 移除 Markdown 语法，返回纯文本
 */
export function getCleanText(text: string) {
  return text
    .replace(/<!--[\s\S]*?-->/g, '') // 移除 HTML 注释（兼容低于 ES2018 的构建目标）
    .replace(/!\[.*?\]\(.*?\)/g, '') // 彻底移除图片
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 链接保留文字
    .replace(/#+\s+(.*)/g, '$1') // 移除标题符号，保留文字
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // 移除加粗
    .replace(/(\*|_)(.*?)\1/g, '$2') // 移除斜体
    .replace(/~~(.*?)~~/g, '$1') // 移除删除线
    .replace(/`(.*?)`/g, '$1') // 移除行内代码块符号
    .replace(/^>\s*/gm, '') // 移除引用符号
    .replace(/^\s*[-*+]\s+/gm, '• ') // 将列表符号统一为优雅的点
    .replace(/^\s*\d+\.\s+/gm, (match) => match.trim() + ' ') // 保持有序列表数字
    .replace(/<[^>]*>/g, '') // 移除其他 HTML 标签
    .replace(/\n{3,}/g, '\n\n') // 合并过多回车
    .trim();
}

/**
 * 计算字数和阅读时间
 */
export function getReadInfo(text: string) {
  const cleanText = getCleanText(text);
  const wordCount = cleanText.replace(/\s/g, '').length;
  const readTime = Math.ceil(wordCount / 500);
  
  return { wordCount, readTime };
}

/**
 * 在 Markdown 开头注入字数和阅读时间信息
 */
export function injectReadInfo(markdown: string) {
  const { wordCount, readTime } = getReadInfo(markdown);
  const info = `<div class="chicpage-read-info" style="margin:0.75em 0 1em 0;padding:0;line-height:1.65;">全文共 ${wordCount} 字<br />\n预计阅读时间 ${readTime} 分钟</div>\n\n`;
  return info + markdown;
}
