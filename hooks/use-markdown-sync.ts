/**
 * Markdown 同步 Hook
 * 处理 Markdown 到 HTML 的转换和同步
 */

import { useEffect } from 'react';
import { markdownToHtml } from '@/lib/markdown';
import { injectReadInfo } from '@/lib/utils-content';
import { EXPORT } from '@/config/constants';

interface MarkdownSyncOptions {
  markdown: string;
  styleTheme: 'wechat' | 'poster';
  showWordCount: boolean;
  onHtmlChange: (html: string) => void;
}

export function useMarkdownSync({
  markdown,
  styleTheme,
  showWordCount,
  onHtmlChange,
}: MarkdownSyncOptions) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const contentToRender = showWordCount
        ? injectReadInfo(markdown)
        : markdown;
      const res = await markdownToHtml(contentToRender);
      onHtmlChange(res);
    }, EXPORT.MARKDOWN_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [markdown, styleTheme, showWordCount, onHtmlChange]);
}
