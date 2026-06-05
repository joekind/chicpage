'use client';

import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';
import TurndownService from 'turndown';

import type { EditorMethods } from '@/components/workspace/editor/mdx-editor';
import {
  applyPanguSpacing,
  buildTableMarkdown,
  clearInlineFormatting,
  PAGE_BREAK_SNIPPET,
  POSTER_SNIPPETS,
  replaceImageWidth,
  type StyleTheme,
} from '@/lib/editor/commands';
import { storeImageLocally } from '@/lib/images';
import { useStore } from '@/store/use-store';

/** 调整图片宽度时，合并历史记录的去抖窗口（毫秒） */
const IMAGE_WIDTH_HISTORY_DEBOUNCE = 700;

interface UseEditorCommandsParams {
  editorRef: React.RefObject<EditorMethods | null>;
  styleTheme: StyleTheme;
  pushHistory: (markdown?: string) => void;
  setMarkdown: (markdown: string) => void;
  undo: () => void;
  redo: () => void;
  setIsUploading: (value: boolean) => void;
  showUploadNotice: (
    type: 'loading' | 'success' | 'error',
    message: string,
    duration?: number,
  ) => void;
}

/**
 * 桌面端与移动端共享的编辑器命令集合。
 *
 * 所有「插入 / 包裹 / 变换」逻辑都收敛在此，模板来自 {@link POSTER_SNIPPETS} 等
 * 常量，确保两端行为一致。组件只需把 store 中的 editorRef / styleTheme / 历史
 * 操作以及上传提示回调传入即可。
 */
export function useEditorCommands({
  editorRef,
  styleTheme,
  pushHistory,
  setMarkdown,
  undo,
  redo,
  setIsUploading,
  showUploadNotice,
}: UseEditorCommandsParams) {
  const imageWidthHistoryTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (imageWidthHistoryTimerRef.current) {
        clearTimeout(imageWidthHistoryTimerRef.current);
      }
    };
  }, []);

  const handleWrapText = useCallback(
    (before: string, after?: string) => {
      pushHistory(editorRef.current?.getMarkdown());
      editorRef.current?.wrapSelection(before, after ?? before);
    },
    [editorRef, pushHistory],
  );

  const handleInsertText = useCallback(
    (text: string) => {
      pushHistory(editorRef.current?.getMarkdown());
      editorRef.current?.insertMarkdown(text);
    },
    [editorRef, pushHistory],
  );

  const handleInsertAtLineStart = useCallback(
    (prefix: string) => {
      pushHistory(editorRef.current?.getMarkdown());
      editorRef.current?.insertAtLineStart(prefix);
    },
    [editorRef, pushHistory],
  );

  const handleInsertPageBreak = useCallback(() => {
    handleInsertText(PAGE_BREAK_SNIPPET);
  }, [handleInsertText]);

  const handleHeading = useCallback(
    (level: 1 | 2) => {
      if (styleTheme === 'poster') {
        handleInsertText(
          level === 1 ? POSTER_SNIPPETS.headingPrimary : POSTER_SNIPPETS.headingSecondary,
        );
        return;
      }

      handleInsertAtLineStart(level === 1 ? '# ' : '## ');
    },
    [handleInsertAtLineStart, handleInsertText, styleTheme],
  );

  const handleBold = useCallback(() => {
    if (styleTheme === 'poster') {
      handleWrapText(POSTER_SNIPPETS.bold.before, POSTER_SNIPPETS.bold.after);
      return;
    }

    handleWrapText('**');
  }, [handleWrapText, styleTheme]);

  const handleQuote = useCallback(() => {
    if (styleTheme === 'poster') {
      handleInsertText(POSTER_SNIPPETS.quote);
      return;
    }

    handleInsertAtLineStart('> ');
  }, [handleInsertAtLineStart, handleInsertText, styleTheme]);

  const handleSeparator = useCallback(() => {
    if (styleTheme === 'poster') {
      handleInsertText(POSTER_SNIPPETS.separator);
      return;
    }

    handleInsertText('\n\n---\n\n');
  }, [handleInsertText, styleTheme]);

  const handleInsertTable = useCallback(
    (rows: number, cols: number) => {
      handleInsertText(buildTableMarkdown(rows, cols));
    },
    [handleInsertText],
  );

  const handleClearFormatting = useCallback(() => {
    const selectionInfo = editorRef.current?.getSelection();
    if (!selectionInfo || selectionInfo.empty) return;

    const cleaned = clearInlineFormatting(selectionInfo.text);
    if (cleaned === null) return;

    pushHistory(editorRef.current?.getMarkdown());
    editorRef.current?.replaceRange(selectionInfo.from, selectionInfo.to, cleaned);
    setMarkdown(editorRef.current?.getMarkdown() || '');
  }, [editorRef, pushHistory, setMarkdown]);

  const applyPangu = useCallback(() => {
    const text = editorRef.current?.getMarkdown() || useStore.getState().markdown;
    pushHistory(text);
    const processed = applyPanguSpacing(text);
    setMarkdown(processed);
    editorRef.current?.setMarkdown(processed);
  }, [editorRef, pushHistory, setMarkdown]);

  const handleImageFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;

      setIsUploading(true);
      showUploadNotice('loading', '正在处理图片...');

      try {
        const localUrl = await storeImageLocally(file);

        if (editorRef.current) {
          pushHistory(editorRef.current.getMarkdown());
          editorRef.current.insertMarkdown(`![${file.name}](${localUrl})`);
          setMarkdown(editorRef.current.getMarkdown());
        }

        showUploadNotice('success', '图片已插入编辑区', 2200);
      } catch (error) {
        console.error('图片处理失败:', error);
        showUploadNotice('error', '图片处理失败，请重试', 2600);
      } finally {
        setIsUploading(false);
      }
    },
    [editorRef, pushHistory, setIsUploading, setMarkdown, showUploadNotice],
  );

  const handlePaste = useCallback(
    async (event: React.ClipboardEvent | ClipboardEvent) => {
      if (event.defaultPrevented) return;

      const clipboardData =
        (event as React.ClipboardEvent).clipboardData || (event as ClipboardEvent).clipboardData;
      if (!clipboardData) return;

      const htmlData = clipboardData.getData('text/html');
      const items = Array.from(clipboardData.items);
      const imageItem = items.find(item => item.type.includes('image'));

      if (imageItem) {
        event.preventDefault();
        const file = imageItem.getAsFile();
        if (file) handleImageFile(file);
        return;
      }

      if (htmlData && !clipboardData.types.includes('Files')) {
        event.preventDefault();
        const turndown = new TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
          hr: '---',
        });

        turndown.keep(['kbd', 'sup', 'sub', 'mark']);
        const markdownContent = turndown.turndown(htmlData);

        if (editorRef.current) {
          pushHistory(editorRef.current.getMarkdown());
          editorRef.current.insertMarkdown(markdownContent);
          setMarkdown(editorRef.current.getMarkdown());
        }
      }
    },
    [editorRef, handleImageFile, pushHistory, setMarkdown],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = readerEvent => {
        const content = readerEvent.target?.result as string;

        if (content) {
          pushHistory(editorRef.current?.getMarkdown());
          setMarkdown(content);
          editorRef.current?.setMarkdown(content);
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    [editorRef, pushHistory, setMarkdown],
  );

  const handleInsertImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) handleImageFile(file);
    };
    input.click();
  }, [handleImageFile]);

  const handleImageWidthChange = useCallback(
    (imageIndex: number, widthPercent: number) => {
      const currentMarkdown = editorRef.current?.getMarkdown() || useStore.getState().markdown;
      const nextMarkdown = replaceImageWidth(currentMarkdown, imageIndex, widthPercent);

      if (nextMarkdown === null) return;

      if (!imageWidthHistoryTimerRef.current) {
        pushHistory(currentMarkdown);
      } else {
        clearTimeout(imageWidthHistoryTimerRef.current);
      }

      imageWidthHistoryTimerRef.current = setTimeout(() => {
        imageWidthHistoryTimerRef.current = null;
      }, IMAGE_WIDTH_HISTORY_DEBOUNCE);

      editorRef.current?.setMarkdown(nextMarkdown);
      setMarkdown(nextMarkdown);
    },
    [editorRef, pushHistory, setMarkdown],
  );

  const handleUndo = useCallback(() => {
    undo();
    editorRef.current?.setMarkdown(useStore.getState().markdown);
  }, [editorRef, undo]);

  const handleRedo = useCallback(() => {
    redo();
    editorRef.current?.setMarkdown(useStore.getState().markdown);
  }, [editorRef, redo]);

  return {
    handleWrapText,
    handleInsertText,
    handleInsertAtLineStart,
    handleInsertPageBreak,
    handleHeading,
    handleBold,
    handleQuote,
    handleSeparator,
    handleInsertTable,
    handleClearFormatting,
    applyPangu,
    handleImageFile,
    handlePaste,
    handleFileUpload,
    handleInsertImage,
    handleImageWidthChange,
    handleUndo,
    handleRedo,
  };
}
