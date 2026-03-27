"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  slides: { 
    html: string; 
    index: number; 
    totalInGroup: number; 
    pageInGroup: number 
  }[];
  themeBackground: string;
  themeCSS: string;
}

export function ExportPreviewDialog({
  isOpen,
  onClose,
  onConfirm,
  slides,
  themeBackground,
  themeCSS,
}: ExportPreviewDialogProps) {
  if (!isOpen) return null;

  // 将 CSS 中的 #xhs-content 替换为 .preview-content，避免 ID 冲突
  const scopedCSS = themeCSS.replace(/#xhs-content/g, ".preview-content");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <style>{scopedCSS}</style>
      <div className="relative w-[90vw] max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">导出预览</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              共 {slides.length} 页，确认无误后点击导出
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="size-5 text-zinc-600" />
          </button>
        </div>

        {/* Preview Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((slide) => (
              <div
                key={slide.index}
                className="relative group rounded-lg overflow-hidden border-2 border-zinc-200 hover:border-indigo-400 transition-all shadow-sm"
              >
                <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  第 {slide.index + 1} 页
                </div>
                <div
                  className="w-full overflow-hidden relative"
                  style={{
                    background: themeBackground,
                    aspectRatio: "334/584",
                    transform: "scale(1)",
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "32px 26px",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      className="preview-content w-full"
                      dangerouslySetInnerHTML={{ __html: slide.html }}
                      style={{
                        height: "100%",
                        fontSize: "15px",
                        lineHeight: 1.85,
                        overflow: "hidden",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 px-6 text-sm font-bold"
          >
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-10 px-6 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            确认导出 {slides.length} 页
          </Button>
        </div>
      </div>
    </div>
  );
}
