"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { cn } from "@/lib/utils";

export interface EditorMethods {
  getMarkdown: () => string;
  setMarkdown: (md: string) => void;
  insertMarkdown: (text: string) => void;
  insertAtLineStart: (prefix: string) => void;
  wrapSelection: (before: string, after: string) => void;
  getSelection: () => SelectionInfo;
  copySelection: () => string;
  cutSelection: () => string;
  pasteText: (text: string) => void;
  replaceRange: (from: number, to: number, text: string) => void;
  deleteCurrentLine: () => void;
  focus: () => void;
  getSelectionCoords: () => { top: number; left: number; width: number; height: number; } | null;
}

export interface SelectionInfo {
  from: number;
  to: number;
  text: string;
  empty: boolean;
}

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  onPaste?: (e: ClipboardEvent) => void;
  onSelectionChange?: (info: SelectionInfo) => void;
  onPushHistory?: (markdown?: string) => void;
  className?: string;
  isXHSTheme?: boolean;
}

// 自定义亮色主题
const chicpageTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "14px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
    backgroundColor: "transparent",
  },
  ".cm-content": {
    padding: "24px 32px 80px",
    caretColor: "#2563eb",
    lineHeight: "1.75",
  },
  ".cm-line": {
    padding: "0",
  },
  ".cm-focused": {
    outline: "none",
  },
  ".cm-editor.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
    color: "#d1d5db",
    paddingRight: "8px",
    minWidth: "40px",
  },
  ".cm-foldGutter": {
    minWidth: "20px",
  },
  ".cm-foldGutter .cm-gutterElement": {
    color: "#64748b",
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "1",
    opacity: "1",
    cursor: "pointer",
  },
  ".cm-foldGutter .cm-gutterElement:hover": {
    color: "#334155",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "#9ca3af",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(37,99,235,0.06)",
    borderRadius: "4px",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "#dbeafe !important",
  },
  // Markdown 语法高亮
  ".cm-heading": { fontWeight: "700", color: "#111827" },
  ".cm-heading1": { fontSize: "1.3em", color: "#0f172a" },
  ".cm-heading2": { fontSize: "1.15em", color: "#1e293b" },
  ".cm-strong": { fontWeight: "700", color: "#1f2937" },
  ".cm-emphasis": { fontStyle: "italic", color: "#374151" },
  ".cm-link": { color: "#1d4ed8", textDecoration: "underline" },
  ".cm-url": { color: "#2563eb" },
  ".cm-quote": { color: "#6b7280", borderLeft: "3px solid #e5e5eb", paddingLeft: "8px" },
  ".cm-monospace": { fontFamily: 'Consolas, "Courier New", monospace', backgroundColor: "rgba(148,163,184,0.16)", borderRadius: "3px", padding: "0 3px", color: "#0f172a" },
});

const EditorWrapper = forwardRef<EditorMethods, EditorProps>(
  ({ markdown: markdownContent, onChange, onPaste, onSelectionChange, onPushHistory, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);
    const onPushHistoryRef = useRef(onPushHistory);
    const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingHistorySnapshotRef = useRef<string | null>(null);
    const isApplyingExternalChangeRef = useRef(false);

    onChangeRef.current = onChange;
    onPushHistoryRef.current = onPushHistory;

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      getMarkdown: () => viewRef.current?.state.doc.toString() ?? "",
      getSelection: () => {
        const view = viewRef.current;
        if (!view) return { from: 0, to: 0, text: "", empty: true };
        const sel = view.state.selection.main;
        return {
          from: sel.from,
          to: sel.to,
          text: view.state.doc.sliceString(sel.from, sel.to),
          empty: sel.empty,
        };
      },
      setMarkdown: (md: string) => {
        const view = viewRef.current;
        if (!view) return;
        const current = view.state.doc.toString();
        if (current === md) return;
        isApplyingExternalChangeRef.current = true;
        view.dispatch({
          changes: { from: 0, to: current.length, insert: md },
        });
        isApplyingExternalChangeRef.current = false;
      },
      insertMarkdown: (text: string) => {
        const view = viewRef.current;
        if (!view) return;
        const { from, to } = view.state.selection.main;
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
        });
        view.focus();
      },
      insertAtLineStart: (prefix: string) => {
        const view = viewRef.current;
        if (!view) return;
        const { from, to } = view.state.selection.main;
        const doc = view.state.doc;
        const startLine = view.state.doc.lineAt(from);
        const adjustedTo =
          to > from && to === doc.lineAt(to).from ? Math.max(from, to - 1) : to;
        const endLine = doc.lineAt(adjustedTo);
        const getLinePrefix = (index: number) =>
          prefix === "1. " ? `${index + 1}. ` : prefix;
        const replaceablePrefixPattern =
          /^(\s*)(?:(?:-\s+\[[ xX]\]\s+)|(?:[-*+]\s+)|(?:\d+\.\s+)|(?:>\s*))/;
        const changes = [];
        let totalDelta = 0;
        let firstLineDelta = 0;
        for (let lineNumber = startLine.number; lineNumber <= endLine.number; lineNumber += 1) {
          const line = view.state.doc.line(lineNumber);
          const index = lineNumber - startLine.number;
          const nextPrefix = getLinePrefix(index);
          const match = line.text.match(replaceablePrefixPattern);
          if (match) {
            const change = {
              from: line.from + match[1].length,
              to: line.from + match[0].length,
              insert: nextPrefix,
            };
            const delta = nextPrefix.length - (change.to - change.from);
            if (lineNumber === startLine.number) firstLineDelta = delta;
            totalDelta += delta;
            changes.push(change);
          } else {
            const change = { from: line.from, to: line.from, insert: nextPrefix };
            if (lineNumber === startLine.number) firstLineDelta = nextPrefix.length;
            totalDelta += nextPrefix.length;
            changes.push(change);
          }
        }
        view.dispatch({
          changes,
          selection: {
            anchor: from + firstLineDelta,
            head: to + totalDelta,
          },
        });
        view.focus();
      },
      wrapSelection: (before: string, after: string) => {
        const view = viewRef.current;
        if (!view) return;
        const { from, to } = view.state.selection.main;
        const selected = view.state.doc.sliceString(from, to);
        const insert = before + selected + after;
        view.dispatch({
          changes: { from, to, insert },
          selection: { anchor: from + before.length, head: from + before.length + selected.length },
        });
        view.focus();
      },
      copySelection: () => {
        const view = viewRef.current;
        if (!view) return "";
        const { from, to } = view.state.selection.main;
        return view.state.doc.sliceString(from, to);
      },
      cutSelection: () => {
        const view = viewRef.current;
        if (!view) return "";
        const { from, to } = view.state.selection.main;
        const selected = view.state.doc.sliceString(from, to);
        if (from !== to) {
          view.dispatch({
            changes: { from, to, insert: "" },
            selection: { anchor: from },
          });
          view.focus();
        }
        return selected;
      },
      pasteText: (text: string) => {
        const view = viewRef.current;
        if (!view) return;
        const { from, to } = view.state.selection.main;
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
        });
        view.focus();
      },
      replaceRange: (from: number, to: number, text: string) => {
        const view = viewRef.current;
        if (!view) return;
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
        });
        view.focus();
      },
      deleteCurrentLine: () => {
        const view = viewRef.current;
        if (!view) return;
        const { from } = view.state.selection.main;
        const line = view.state.doc.lineAt(from);
        const deleteTo =
          line.number < view.state.doc.lines ? view.state.doc.line(line.number + 1).from : line.to;
        const nextAnchor = Math.min(line.from, view.state.doc.length - (deleteTo - line.from));
        view.dispatch({
          changes: { from: line.from, to: deleteTo, insert: "" },
          selection: { anchor: Math.max(0, nextAnchor) },
        });
        view.focus();
      },
      focus: () => {
        viewRef.current?.focus();
      },
      getSelectionCoords: () => {
        const view = viewRef.current;
        if (!view) return null;
        const sel = view.state.selection.main;
        if (sel.empty) return null;

        try {
          const startCoords = view.coordsAtPos(sel.from);
          const endCoords = view.coordsAtPos(sel.to);
          if (!startCoords) return null;

          const right = endCoords?.right ?? startCoords.right;
          const left = Math.min(startCoords.left, endCoords?.left ?? startCoords.left);
          const top = Math.min(startCoords.top, endCoords?.top ?? startCoords.top);
          const bottom = Math.max(startCoords.bottom, endCoords?.bottom ?? startCoords.bottom);
          const width = Math.max(0, right - left);

          return {
            top,
            left,
            width,
            height: (bottom - top) || 20
          };
        } catch {
          return null;
        }
      }
    }));

    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;

      const current = view.state.doc.toString();
      if (current === markdownContent) return;

      isApplyingExternalChangeRef.current = true;
      view.dispatch({
        changes: { from: 0, to: current.length, insert: markdownContent },
      });
      isApplyingExternalChangeRef.current = false;
    }, [markdownContent]);

    // 初始化 CodeMirror
    useEffect(() => {
      if (!containerRef.current) return;

      const state = EditorState.create({
        doc: markdownContent,
        extensions: [
          lineNumbers(),
          foldGutter(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          drawSelection(),
          bracketMatching(),
          history(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
          }),
          keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap, indentWithTab]),
          chicpageTheme,
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              onChangeRef.current(newContent);

              // 防抖历史记录：用户停止输入 800ms 后记录变更前快照
              if (onPushHistoryRef.current && !isApplyingExternalChangeRef.current) {
                if (pendingHistorySnapshotRef.current === null) {
                  pendingHistorySnapshotRef.current = update.startState.doc.toString();
                }
                if (historyTimeoutRef.current) {
                  clearTimeout(historyTimeoutRef.current);
                }
                historyTimeoutRef.current = setTimeout(() => {
                  const snapshot = pendingHistorySnapshotRef.current;
                  pendingHistorySnapshotRef.current = null;
                  if (snapshot !== null && snapshot !== viewRef.current?.state.doc.toString()) {
                    onPushHistoryRef.current?.(snapshot);
                  }
                }, 800);
              }
            }
            if (update.selectionSet || update.docChanged) {
              const sel = update.state.selection.main;
              onSelectionChange?.({
                from: sel.from,
                to: sel.to,
                text: update.state.doc.sliceString(sel.from, sel.to),
                empty: sel.empty
              });
            }
          }),
          EditorView.domEventHandlers({
            paste(event) {
              if (onPaste) {
                onPaste(event);
                event.stopPropagation();
                return event.defaultPrevented;
              }
              return false;
            }
          })
        ],
      });

      const view = new EditorView({ state, parent: containerRef.current });
      viewRef.current = view;

      return () => {
        // 组件卸载时，如果有待保存的历史记录，立即保存
        if (historyTimeoutRef.current) {
          clearTimeout(historyTimeoutRef.current);
          if (viewRef.current && onPushHistoryRef.current) {
            const currentContent = viewRef.current.state.doc.toString();
            const snapshot = pendingHistorySnapshotRef.current;
            if (snapshot !== null && snapshot !== currentContent) {
              onPushHistoryRef.current(snapshot);
            }
          }
        }
        view.destroy();
        viewRef.current = null;
      };
      // 只初始化一次
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        ref={containerRef}
        className={cn("mdx-editor-container h-full w-full overflow-auto no-scrollbar", className)}
      />
    );
  }
);

EditorWrapper.displayName = "MarkdownEditor";

export default EditorWrapper;
