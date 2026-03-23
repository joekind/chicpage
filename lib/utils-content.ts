/**
 * 移除 Markdown 语法，返回纯文本
 */
export function getCleanText(text: string) {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '') // 优先彻底移除图片标记（含 Alt 和 URL）
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接标记，保留链接文字
    .replace(/#+\s/g, '') // 移除标题符号
    .replace(/[*\-_~`]/g, '') // 移除加粗、斜体、删除线等符号
    .replace(/:::.*?|:::/g, '') // 移除自定义容器指令 (:::tip 等)
    .replace(/^>\s*/gm, '') // 移除引用符号
    .replace(/^\s*-\s+/gm, '') // 移除无序列表符号
    .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表符号
    .replace(/<[^>]*>/g, '') // 移除 HTML 标签
    .replace(/\n{3,}/g, '\n\n') // 合并过多的回车
    .trim();
}

/**
 * 计算字数和阅读时间
 * @param text Markdown 源码
 */
export function getReadInfo(text: string) {
  const cleanText = getCleanText(text);
  // 过滤掉纯空格和换行符后的真实长度
  const wordCount = cleanText.replace(/\s/g, '').length;
  // 中文阅读速度约 500 字/分钟
  const readTime = Math.ceil(wordCount / 500);
  
  return { wordCount, readTime };
}

/**
 * 在 Markdown 开头注入字数和阅读时间信息
 */
export function injectReadInfo(markdown: string) {
  const { wordCount, readTime } = getReadInfo(markdown);
  // 使用居中/引用样式
  const info = `> 💡 全文共 ${wordCount} 字，预计阅读时间 ${readTime} 分钟。\n\n---\n\n`;
  return info + markdown;
}
