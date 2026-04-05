"use client";

import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  XHS_CARD_W,
  XHS_CARD_H,
  XHS_STATUS_H,
  XHS_FOOTER_H,
  XHS_CONTENT_H,
} from "@/components/editor/xhs-slide-preview";

interface ExportPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  slides: { 
    html: string; 
    index: number; 
    totalInGroup: number; 
    pageInGroup: number 
  }[];
  themeBackground: string;
  themeBackgroundImage?: string;
  themeBackgroundRepeat?: string;
  themeBackgroundSize?: string;
  themeBackgroundPosition?: string;
  themeCSS: string;
}

export function ExportPreviewDialog({
  isOpen,
  onClose,
  onConfirm,
  slides,
  themeBackground,
  themeBackgroundImage,
  themeBackgroundRepeat,
  themeBackgroundSize,
  themeBackgroundPosition,
  themeCSS,
}: ExportPreviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = React.useState<number | null>(null);
  const THUMB_SCALE = 0.5;

  React.useEffect(() => {
    if (!isOpen) {
      setActiveSlideIndex(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (activeSlideIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSlideIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveSlideIndex((prev) =>
          prev === null ? prev : Math.max(0, prev - 1),
        );
      }
      if (e.key === "ArrowRight") {
        setActiveSlideIndex((prev) =>
          prev === null ? prev : Math.min(slides.length - 1, prev + 1),
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSlideIndex, slides.length]);

  if (!isOpen) return null;

  // 将 CSS 中的 #xhs-content 替换为 .preview-content，避免 ID 冲突
  const scopedCSS = themeCSS.replace(/#xhs-content/g, ".preview-content");
  const activeSlide =
    activeSlideIndex !== null ? slides[activeSlideIndex] : undefined;

  const renderSlideCard = (slide: ExportPreviewDialogProps["slides"][number], scale: number) => {
    const width = Math.round(XHS_CARD_W * scale);
    const height = Math.round(XHS_CARD_H * scale);
    return (
      <div
        className="overflow-hidden relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div
          style={{
            width: `${XHS_CARD_W}px`,
            height: `${XHS_CARD_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundColor: themeBackground,
            backgroundImage: themeBackgroundImage,
            backgroundRepeat: themeBackgroundRepeat,
            backgroundSize: themeBackgroundSize,
            backgroundPosition: themeBackgroundPosition,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ height: XHS_STATUS_H, flexShrink: 0 }} />
          <div
            style={{
              width: "100%",
              height: `calc(100% - ${XHS_STATUS_H}px - ${XHS_FOOTER_H}px)`,
              padding: "32px 26px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <div
              className="preview-content w-full"
              dangerouslySetInnerHTML={{ __html: slide.html }}
              style={{
                height: `${XHS_CONTENT_H}px`,
                overflow: "hidden",
              }}
            />
          </div>
          <div style={{ height: XHS_FOOTER_H, flexShrink: 0 }} />
        </div>
      </div>
    );
  };

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
            disabled={isSubmitting}
          >
            <X className="size-5 text-zinc-600" />
          </button>
        </div>

        {/* Preview Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((slide, idx) => (
              <div
                key={slide.index}
                className="relative group rounded-lg overflow-hidden border border-zinc-200 transition-colors hover:border-zinc-300 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                onClick={() => setActiveSlideIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveSlideIndex(idx);
                  }
                }}
              >
                <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  第 {slide.index + 1} 页
                </div>
                {slide.totalInGroup > 1 && (
                  <div className="absolute top-2 right-2 z-10 bg-white/80 text-zinc-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-zinc-200 backdrop-blur-sm">
                    分组 {slide.pageInGroup + 1}/{slide.totalInGroup}
                  </div>
                )}
                <div className="flex justify-center px-3 pb-3 pt-9">
                  {renderSlideCard(slide, THUMB_SCALE)}
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
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await onConfirm();
                onClose();
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="h-10 px-6 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? "导出中..." : `确认导出 ${slides.length} 页`}
          </Button>
        </div>
      </div>

      {activeSlide && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 p-6"
          onClick={() => setActiveSlideIndex(null)}
        >
          <div
            className="relative rounded-xl bg-white/95 p-3 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveSlideIndex(null)}
              className="absolute -top-3 -right-3 z-10 rounded-full bg-zinc-900 text-white p-1.5 hover:bg-zinc-700"
              aria-label="关闭放大预览"
            >
              <X className="size-4" />
            </button>
            <div className="mb-2 text-xs font-bold text-zinc-600 text-center">
              第 {activeSlide.index + 1} 页（←/→ 切页，Esc 关闭）
            </div>
            {renderSlideCard(activeSlide, 1)}
            <button
              type="button"
              onClick={() =>
                setActiveSlideIndex((prev) =>
                  prev === null ? prev : Math.max(0, prev - 1),
                )
              }
              disabled={activeSlideIndex === 0}
              className="absolute left-[-46px] top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-800 disabled:opacity-30"
              aria-label="上一页"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveSlideIndex((prev) =>
                  prev === null ? prev : Math.min(slides.length - 1, prev + 1),
                )
              }
              disabled={activeSlideIndex === slides.length - 1}
              className="absolute right-[-46px] top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-zinc-800 disabled:opacity-30"
              aria-label="下一页"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
