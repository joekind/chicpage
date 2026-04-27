/**
 * Markdown 同步 Hook
 * 处理 Markdown 到 HTML 的转换和同步
 */

import { useEffect } from 'react';
import { markdownToHtml, injectReadInfo } from '@/lib/content';
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
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const contentToRender = showWordCount
          ? injectReadInfo(markdown)
          : markdown;
        const res = await markdownToHtml(contentToRender);

        if (!cancelled) {
          onHtmlChange(res);
        }
      } catch (error) {
        console.error('Markdown render failed:', error);
      }
    }, EXPORT.MARKDOWN_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [markdown, styleTheme, showWordCount, onHtmlChange]);
}
