"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsertLinkDialogProps {
  isOpen: boolean;
  url: string;
  text: string;
  onUrlChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function InsertLinkDialog({
  isOpen,
  url,
  text,
  onUrlChange,
  onTextChange,
  onClose,
  onConfirm,
}: InsertLinkDialogProps) {
  const urlInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      urlInputRef.current?.focus();
      urlInputRef.current?.select();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/45 backdrop-blur-sm">
      <div className="relative w-[92vw] max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900">插入链接</h2>
            <p className="mt-1 text-xs text-zinc-500">填写链接地址和显示文字，然后插入到当前编辑位置。</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="关闭插入链接弹窗"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-800">链接地址</label>
            <input
              ref={urlInputRef}
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com"
              className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-800">显示文字</label>
            <input
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="链接文字"
              className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50 px-5 py-4">
          <Button variant="ghost" onClick={onClose} className="h-10 px-5 text-sm font-bold">
            取消
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!url.trim()}
            className="h-10 px-5 text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800"
          >
            插入链接
          </Button>
        </div>
      </div>
    </div>
  );
}
