"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileCode, FileLineChart, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  markdown: string;
  fileName?: string;
}

export function ExportButton({ previewRef, markdown, fileName = "document" }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const exportToHTML = () => {
    if (!previewRef.current) return;
    try {
      const htmlContent = previewRef.current.innerHTML;
      const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.8; max-width: 677px; margin: 0 auto; padding: 20px; }
    img { max-width: 100%; height: auto; display: block; margin: 1em auto; }
    pre, code { font-family: Consolas, "Courier New", monospace; background: #f5f5f5; padding: 1em; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ccc; padding-left: 16px; margin: 1em 0; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('HTML export failed:', error);
      setExportStatus('error');
    }
  };

  const exportToMarkdown = () => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Markdown export failed:', error);
      setExportStatus('error');
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-9 gap-2 rounded-xl px-4 text-xs font-bold transition-all",
          isOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-100"
        )}
      >
        <Download className="size-3.5" />
        导出
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 z-50 w-56 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-zinc-200/50 overflow-hidden p-2"
            >
              <button
                onClick={() => { exportToHTML(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileCode className="size-4 text-blue-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span>导出 HTML</span>
                  <span className="text-[10px] text-zinc-400 font-normal">保持原始样式</span>
                </div>
              </button>

              <button
                onClick={() => { exportToMarkdown(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <FileLineChart className="size-4 text-purple-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span>导出 Markdown</span>
                  <span className="text-[10px] text-zinc-400 font-normal">仅导出纯文本</span>
                </div>
              </button>

              {exportStatus !== 'idle' && (
                <div className={cn(
                  "mt-2 px-3 py-2 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-2",
                  exportStatus === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                  {exportStatus === 'success' ? <><Check className="size-3" /> 导出成功</> : <><XCircle className="size-3" /> 导出失败</>}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
