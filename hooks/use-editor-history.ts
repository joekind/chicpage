/**
 * 编辑器历史记录管理 Hook
 * 处理撤销/重做功能
 */

import { useCallback, useRef } from 'react';
import { useStore } from '@/store/use-store';
import type { EditorMethods } from '@/types';

export function useEditorHistory(editorRef: React.RefObject<EditorMethods | null>) {
  const { undo, redo, pushHistory } = useStore();
  const lastSavedContentRef = useRef<string>('');
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 防抖的历史记录函数
   */
  const scheduleHistorySave = useCallback((content: string) => {
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    historyTimeoutRef.current = setTimeout(() => {
      if (content !== lastSavedContentRef.current) {
        pushHistory();
        lastSavedContentRef.current = content;
      }
    }, 800); // EXPORT.HISTORY_DEBOUNCE_MS
  }, [pushHistory]);

  /**
   * 执行撤销操作
   */
  const handleUndo = useCallback(() => {
    undo();
    if (editorRef.current) {
      const historyState = editorRef.current.getMarkdown();
      editorRef.current.setMarkdown(historyState);
      lastSavedContentRef.current = historyState;
    }
  }, [undo, editorRef]);

  /**
   * 执行重做操作
   */
  const handleRedo = useCallback(() => {
    redo();
    if (editorRef.current) {
      const historyState = editorRef.current.getMarkdown();
      editorRef.current.setMarkdown(historyState);
      lastSavedContentRef.current = historyState;
    }
  }, [redo, editorRef]);

  return {
    scheduleHistorySave,
    handleUndo,
    handleRedo,
  };
}
