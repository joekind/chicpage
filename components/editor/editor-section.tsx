"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Type, Layers, Loader2 } from "lucide-react";
import type { EditorMethods } from "./mdx-editor";

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
  styleTheme: string;
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
  styleTheme,
}: EditorSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex flex-col bg-white rounded-none border border-zinc-900/10 shadow-2xl shadow-zinc-200/50 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden relative",
        layoutMode === "split"
          ? "flex-1"
          : layoutMode === "edit"
          ? "w-full max-w-5xl mx-auto"
          : "w-0 opacity-0 pointer-events-none p-0"
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900/5" />
      
      <div
        className="flex-1 overflow-y-auto relative flex flex-col no-scrollbar px-16 py-12"
        onDrop={(e) => {
          e.preventDefault();
          Array.from(e.dataTransfer.files).forEach(onImageFile);
        }}
        onPaste={onPaste}
      >
        <input
          id="md-import-input"
          type="file"
          accept=".md,.markdown"
          className="hidden"
          onChange={onFileUpload}
        />
        <MDXEditor
          ref={editorRef}
          markdown={markdown}
          onChange={setMarkdown}
          onPaste={onPaste}
        />
      </div>

      <div className="flex items-center justify-between px-8 py-4 bg-zinc-50 border-t border-zinc-900/5 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
        <div className="flex items-center gap-6">
          {isUploading && (
            <div className="flex items-center gap-2 text-zinc-900 animate-pulse">
              <Loader2 className="size-3 animate-spin" />
              <span>Processing Media</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-zinc-900 font-black">字数统计:</span>
            <span>{markdown.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-900 font-black">预计阅读:</span>
            <span>{Math.ceil(markdown.length / 400)} 分钟</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-zinc-900 font-black">系统状态:</span>
           <span className="text-emerald-500 flex items-center gap-1.5">
             <div className="size-1.5 rounded-full bg-emerald-500" />
             运行良好
           </span>
        </div>
      </div>
    </motion.section>
  );
};
