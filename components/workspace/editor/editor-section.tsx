"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { CheckCircle2, ImagePlus, Loader2, TriangleAlert, X } from "lucide-react";
import type { EditorMethods, SelectionInfo } from "./mdx-editor";
import { getReadInfo } from "@/lib/content";

const MDXEditor = dynamic(() => import("./mdx-editor"), { ssr: false });

interface EditorSectionProps {
  layoutMode: string;
  markdown: string;
  setMarkdown: (md: string) => void;
  editorRef: React.RefObject<EditorMethods | null>;
  onPaste: (e: React.ClipboardEvent | ClipboardEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageFile: (file: File) => void;
  isUploading: boolean;
  uploadNotice?: { type: "loading" | "success" | "error"; message: string } | null;
  styleTheme: string;
  toolbar?: React.ReactNode;
  floatingToolbar?: React.ReactNode;
  onSelectionChange?: (info: SelectionInfo) => void;
  onInsertPageBreak?: () => void;
  onPushHistory?: (markdown?: string) => void;
}

export const EditorSection = ({
  layoutMode,
  markdown,
  setMarkdown,
  editorRef,
  onPaste,
  onFileUpload,
  onImageFile,
  isUploading,
  uploadNotice,
  styleTheme,
  toolbar,
  floatingToolbar,
  onSelectionChange,
  onInsertPageBreak,
  onPushHistory,
}: EditorSectionProps) => {
  const { wordCount, readTime } = getReadInfo(markdown);
  const [showPageBreakTip, setShowPageBreakTip] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("chicpage-hide-pagebreak-tip") !== "1";
  });
  const [isDragOver, setIsDragOver] = useState(false);

  const handleCloseTip = () => {
    setShowPageBreakTip(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("chicpage-hide-pagebreak-tip", "1");
    }
  };

  const uploadNoticeConfig = uploadNotice
    ? uploadNotice.type === "success"
      ? {
          icon: <CheckCircle2 className="size-4" />,
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        }
      : uploadNotice.type === "error"
        ? {
            icon: <TriangleAlert className="size-4" />,
            className: "border-red-200 bg-red-50 text-red-700",
          }
        : {
            icon: <Loader2 className="size-4 animate-spin" />,
            className: "border-zinc-200 bg-white text-zinc-700",
          }
    : null;

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex flex-col bg-[var(--card)] rounded-[22px] border border-zinc-900/8 shadow-2xl shadow-zinc-200/35 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-visible relative",
        isDragOver && "border-zinc-900/15 shadow-[0_0_0_4px_rgba(24,24,27,0.04)]",
        layoutMode === "split"
          ? "flex-1"
          : layoutMode === "edit"
            ? "w-full max-w-5xl mx-auto"
            : "w-0 min-w-0 opacity-0 pointer-events-none p-0 border-0 shadow-none overflow-hidden",
      )}
    >
      {toolbar}

      <div
        className={cn(
          "flex-1 overflow-y-auto relative flex flex-col no-scrollbar px-8 py-8 transition-colors bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(250,250,251,0.72)_100%)] md:px-10 md:py-10 xl:px-12 xl:py-12",
          isDragOver && "bg-zinc-50/70",
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDragOver) setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          const nextTarget = e.relatedTarget;
          if (!nextTarget || !(e.currentTarget as HTMLDivElement).contains(nextTarget as Node)) {
            setIsDragOver(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          Array.from(e.dataTransfer.files).forEach(onImageFile);
        }}
        onPaste={onPaste}
      >
        <AnimatePresence>
          {uploadNotice && uploadNoticeConfig ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={cn(
                "mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm",
                uploadNoticeConfig.className,
              )}
            >
              {uploadNoticeConfig.icon}
              <span>{uploadNotice.message}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {styleTheme === "poster" && showPageBreakTip && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-[var(--muted)] px-4 py-3 text-sm text-zinc-700">
            <div className="flex items-center justify-between gap-3">
              <p className="leading-6">
                输入 <code className="rounded bg-[var(--card)] px-1.5 py-0.5 text-zinc-900">&lt;!--pagebreak--&gt;</code> 可强制分页。
              </p>
              <button
                type="button"
                onClick={() => onInsertPageBreak?.()}
                className="shrink-0 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-700 transition-colors"
              >
                插入分页符
              </button>
              <button
                type="button"
                onClick={handleCloseTip}
                className="shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                aria-label="关闭提示"
                title="关闭并不再显示"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        <input
          id="md-import-input"
          type="file"
          accept=".md,.markdown"
          className="hidden"
          onChange={onFileUpload}
        />
        <div className="relative flex-1">
          <MDXEditor
            ref={editorRef}
            markdown={markdown}
            onChange={setMarkdown}
            onPaste={onPaste}
            onSelectionChange={onSelectionChange}
            onPushHistory={onPushHistory}
          />

          <AnimatePresence>
            {isDragOver ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-[rgba(252,252,253,0.9)] backdrop-blur-[1px]"
              >
                <div className="flex flex-col items-center gap-3 text-center text-zinc-700">
                  <div className="flex size-14 items-center justify-center rounded-full bg-zinc-800 text-white shadow-lg">
                    <ImagePlus className="size-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-zinc-900">松手即可插入图片</p>
                    <p className="mt-1 text-sm text-zinc-500">支持将图片拖到编辑区，自动插入 Markdown 图片语法</p>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {floatingToolbar}
      </div>

      <div className="flex items-center justify-between px-8 py-4 bg-[rgba(252,252,253,0.65)] backdrop-blur-md border-t border-zinc-900/5 font-mono text-[10px] uppercase tracking-widest text-zinc-400 md:px-10">
        <div className="flex items-center gap-6">
          {isUploading && (
            <div className="flex items-center gap-2 text-zinc-800 animate-pulse">
              <Loader2 className="size-3 animate-spin" />
              <span>Processing Media</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-zinc-800 font-black">字数统计:</span>
            <span>{wordCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-800 font-black">预计阅读:</span>
            <span>{readTime} 分钟</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
