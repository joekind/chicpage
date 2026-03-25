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
      className={cn(
        "flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl floating-shadow border border-zinc-200/50 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)] overflow-hidden relative",
        layoutMode === "split"
          ? "flex-1"
          : layoutMode === "edit"
          ? "w-full max-w-4xl mx-auto"
          : "w-0 opacity-0 pointer-events-none p-0"
      )}
    >
      {/* Toolbar has been moved to top-level page for sharing */}
      <div
        className="flex-1 overflow-y-auto relative flex flex-col no-scrollbar px-12 pb-20"
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

      <div className="absolute bottom-6 left-8 flex items-center gap-4 bg-white/60 backdrop-blur-2xl px-4 py-2 rounded-2xl text-[10px] font-bold text-zinc-500 border border-zinc-100 shadow-lg">
        {isUploading && (
          <>
            <div className="flex items-center gap-2 text-indigo-500 animate-pulse">
              <Loader2 className="size-3 animate-spin" />
              <span>Processing Image...</span>
            </div>
            <div className="w-px h-3 bg-zinc-200" />
          </>
        )}
        <div className="flex items-center gap-2">
          <Type className="size-3" />
          <span>{markdown.length} 字符</span>
        </div>
        <div className="w-px h-3 bg-zinc-200" />
        <div className="flex items-center gap-2">
          <Layers className="size-3" />
          <span>约 {Math.ceil(markdown.length / 400)} 分钟阅读</span>
        </div>
      </div>
    </motion.section>
  );
};
