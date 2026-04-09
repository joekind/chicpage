/**
 * 键盘快捷键 Hook
 */

import { useEffect } from 'react';
import type { LayoutMode, PreviewMode, StyleTheme } from '@/types';

interface KeyboardShortcutsOptions {
  layoutMode: LayoutMode;
  previewMode: PreviewMode;
  styleTheme: StyleTheme;
  setLayoutMode: (mode: LayoutMode) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  onCopy: () => void;
  onWrapText: (before: string, after?: string) => void;
  undo: () => void;
  redo: () => void;
}

export function useKeyboardShortcuts({
  layoutMode,
  previewMode,
  styleTheme,
  setLayoutMode,
  setPreviewMode,
  onCopy,
  onWrapText,
  undo,
  redo,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!cmdOrCtrl) return;

      // Ctrl/Cmd + S - 复制到剪贴板
      if (e.key === 's') {
        e.preventDefault();
        onCopy();
        return;
      }

      // Ctrl/Cmd + / - 切换预览模式
      if (e.key === '/') {
        e.preventDefault();
        if (layoutMode === 'edit') {
          setLayoutMode('preview');
        } else if (layoutMode === 'preview') {
          setLayoutMode('split');
        } else {
          setLayoutMode('edit');
        }
        return;
      }

      // Ctrl/Cmd + Shift + P - 切换 PC/移动端预览（贴图模式下禁用）
      if (e.shiftKey && e.key === 'P') {
        e.preventDefault();
        if (styleTheme !== 'poster') {
          setPreviewMode(previewMode === 'pc' ? 'app' : 'pc');
        }
        return;
      }

      // Ctrl/Cmd + Z - 撤销
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y - 重做
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl/Cmd + B - 加粗
      if (e.key === 'b') {
        e.preventDefault();
        if (styleTheme === 'poster') {
          onWrapText('「', '」');
        } else {
          onWrapText('**');
        }
        return;
      }

    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layoutMode, previewMode, styleTheme, setLayoutMode, setPreviewMode, onCopy, onWrapText, undo, redo]);
}
