"use client";

import { useCallback, useState } from "react";
import type React from "react";

import type {
  EditorMethods,
  SelectionInfo,
} from "@/components/workspace/editor/mdx-editor";

const DEFAULT_LINK_URL = "https://";
const FALLBACK_LINK_TEXT = "链接文字";

interface UseInsertLinkParams {
  editorRef: React.RefObject<EditorMethods | null>;
  pushHistory: (markdown?: string) => void;
  setMarkdown: (markdown: string) => void;
  /** 当前选区（编辑器未就绪时作为兜底） */
  selection?: SelectionInfo | null;
}

/**
 * 「插入链接」对话框的状态与确认逻辑，桌面端与移动端共享。
 */
export function useInsertLink({
  editorRef,
  pushHistory,
  setMarkdown,
  selection,
}: UseInsertLinkParams) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState(DEFAULT_LINK_URL);
  const [linkText, setLinkText] = useState("");
  const [linkSelection, setLinkSelection] = useState<SelectionInfo | null>(
    null,
  );

  const handleOpenInsertLink = useCallback(() => {
    const currentSelection =
      editorRef.current?.getSelection() ??
      selection ?? {
        from: 0,
        to: 0,
        text: "",
        empty: true,
      };

    setLinkSelection(currentSelection);
    setLinkText(currentSelection.empty ? "" : currentSelection.text);
    setLinkUrl(DEFAULT_LINK_URL);
    setIsLinkDialogOpen(true);
  }, [editorRef, selection]);

  const handleCloseInsertLink = useCallback(() => {
    setIsLinkDialogOpen(false);
    setLinkSelection(null);
    setLinkUrl(DEFAULT_LINK_URL);
    setLinkText("");
    editorRef.current?.focus();
  }, [editorRef]);

  const handleConfirmInsertLink = useCallback(() => {
    const normalizedUrl = linkUrl.trim();
    if (!normalizedUrl) return;

    const finalText =
      linkText.trim() || linkSelection?.text || FALLBACK_LINK_TEXT;
    const markdownLink = `[${finalText}](${normalizedUrl})`;

    pushHistory(editorRef.current?.getMarkdown());

    if (linkSelection) {
      editorRef.current?.replaceRange(
        linkSelection.from,
        linkSelection.to,
        markdownLink,
      );
    } else {
      editorRef.current?.insertMarkdown(markdownLink);
    }

    setMarkdown(editorRef.current?.getMarkdown() || "");
    handleCloseInsertLink();
  }, [
    editorRef,
    handleCloseInsertLink,
    linkSelection,
    linkText,
    linkUrl,
    pushHistory,
    setMarkdown,
  ]);

  return {
    isLinkDialogOpen,
    linkUrl,
    linkText,
    setLinkUrl,
    setLinkText,
    handleOpenInsertLink,
    handleCloseInsertLink,
    handleConfirmInsertLink,
  };
}
