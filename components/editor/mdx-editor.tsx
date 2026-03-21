"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
import { cn } from "@/lib/utils";

export interface EditorMethods {
  getMarkdown: () => string;
  setMarkdown: (md: string) => void;
  insertMarkdown: (text: string) => void;
  insertAtLineStart: (prefix: string) => void;
  wrapSelection: (before: string, after: string) => void;
}

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
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
    padding: "24px 48px 80px",
    caretColor: "#6366f1",
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
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
    color: "#9ca3af",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(99,102,241,0.04)",
    borderRadius: "4px",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "#e0e7ff !important",
  },
  // Markdown 语法高亮
  ".cm-heading": { fontWeight: "700", color: "#1e1b4b" },
  ".cm-heading1": { fontSize: "1.3em", color: "#312e81" },
  ".cm-heading2": { fontSize: "1.15em", color: "#3730a3" },
  ".cm-strong": { fontWeight: "700", color: "#1f2937" },
  ".cm-emphasis": { fontStyle: "italic", color: "#374151" },
  ".cm-link": { color: "#6366f1", textDecoration: "underline" },
  ".cm-url": { color: "#818cf8" },
  ".cm-quote": { color: "#6b7280", borderLeft: "3px solid #e5e7eb", paddingLeft: "8px" },
  ".cm-monospace": { fontFamily: 'Consolas, "Courier New", monospace', backgroundColor: "rgba(99,102,241,0.08)", borderRadius: "3px", padding: "0 3px", color: "#e06c75" },
});

const EditorWrapper = forwardRef<EditorMethods, EditorProps>(
  ({ markdown: initialMarkdown, onChange, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      getMarkdown: () => viewRef.current?.state.doc.toString() ?? "",
      setMarkdown: (md: string) => {
        const view = viewRef.current;
        if (!view) return;
        const current = view.state.doc.toString();
        if (current === md) return;
        view.dispatch({
          changes: { from: 0, to: current.length, insert: md },
        });
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
        const { from } = view.state.selection.main;
        view.dispatch({
          changes: { from, to: from, insert: prefix },
          selection: { anchor: from + prefix.length },
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
    }));

    // 初始化 CodeMirror
    useEffect(() => {
      if (!containerRef.current) return;

      const state = EditorState.create({
        doc: initialMarkdown,
        extensions: [
          lineNumbers(),
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
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          chicpageTheme,
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
        ],
      });

      const view = new EditorView({ state, parent: containerRef.current });
      viewRef.current = view;

      return () => {
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
