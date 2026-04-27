"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { IPhoneMockup } from "../layout/iphone-mockup";
import { DesktopMockup } from "../layout/desktop-mockup";
import {
  XHSSlidePreview as PosterSlidePreview,
  XHSSlidePreviewMethods,
} from "./xhs-slide-preview";
import { PreviewContent } from "./preview-content";
import type { PosterTheme } from "@/lib/poster-themes";
import type { WechatTheme } from "@/lib/themes";
import type { PosterRatio } from "@/types";
import { getThemeBackgroundStyle } from "@/lib/theme-background";

interface PreviewSectionProps {
  layoutMode: string;
  previewMode: string;
  styleTheme: string;
  html: string;
  activeThemeCss: string;
  activeTheme: WechatTheme;
  activePosterTheme: PosterTheme;
  posterFont: string;
  posterRatio: PosterRatio;
  posterShowHeader: boolean;
  posterShowFooter: boolean;
  imgRadius: number;
  isUploading: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  posterSlideRef: React.RefObject<XHSSlidePreviewMethods | null>;
  onImageWidthChange?: (imageIndex: number, widthPercent: number) => void;
}

export const PreviewSection = ({
  layoutMode,
  previewMode,
  styleTheme,
  html,
  activeThemeCss,
  activeTheme,
  activePosterTheme,
  posterFont,
  posterRatio,
  posterShowHeader,
  posterShowFooter,
  imgRadius,
  isUploading,
  previewRef,
  posterSlideRef,
  onImageWidthChange,
}: PreviewSectionProps) => {
  if (layoutMode === "edit") return null;

  const wechatBackgroundStyle = getThemeBackgroundStyle(activeTheme);

  return (
    <motion.section
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "flex-1 overflow-y-auto bg-[rgba(252,252,253,0.62)] backdrop-blur-sm rounded-[28px] border border-zinc-200/70 flex flex-col items-center justify-center p-5 no-scrollbar relative md:p-6 xl:p-8",
        layoutMode === "preview" ? "w-full" : "",
      )}
    >
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[rgba(252,252,253,0.92)] backdrop-blur-xl px-4 py-2 rounded-2xl shadow-lg border border-zinc-200 text-[12px] font-semibold text-zinc-700"
          >
            <Loader2 className="size-3.5 animate-spin" />
            图片处理中...
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col pt-5 md:pt-6">
        <div className="flex-1 flex items-center justify-center overflow-visible">
          <div
            className="origin-top transition-transform duration-500 ease-out"
            style={{
              transform: "none",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {styleTheme === "poster" ? (
              <div className="relative group flex items-center justify-center">
                <div className="rounded-[32px] border border-zinc-200 bg-[var(--card)] p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
                  <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(252,252,253,0.96)_0%,rgba(244,245,247,0.96)_100%)] p-[3px] shadow-[0_14px_34px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
                    <div className="rounded-[24px] border border-white/85 bg-[linear-gradient(180deg,#fcfcfd_0%,#f7f7f8_100%)] p-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                      <div
                        style={{
                          transform: "scale(1.14)",
                          transformOrigin: "center center",
                        }}
                      >
                        <PosterSlidePreview
                          ref={posterSlideRef}
                          html={html}
                          theme={activePosterTheme}
                          font={posterFont}
                          ratio={posterRatio}
                          showHeader={posterShowHeader}
                          showFooter={posterShowFooter}
                          hideMockUI={true}
                          onImageWidthChange={onImageWidthChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Navigation Arrows */}
                <button
                  onClick={() => posterSlideRef.current?.goPrev()}
                  className="absolute left-[-76px] top-1/2 z-10 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(252,252,253,0.95)] text-zinc-500 shadow-lg ring-1 ring-zinc-200/80 transition-all opacity-100 hover:scale-110 hover:text-zinc-900 hover:shadow-xl active:scale-95"
                  aria-label="上一张"
                >
                  <ChevronLeft className="size-9 stroke-[2.75px]" />
                </button>
                <button
                  onClick={() => posterSlideRef.current?.goNext()}
                  className="absolute right-[-76px] top-1/2 z-10 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(252,252,253,0.95)] text-zinc-500 shadow-lg ring-1 ring-zinc-200/80 transition-all opacity-100 hover:scale-110 hover:text-zinc-900 hover:shadow-xl active:scale-95"
                  aria-label="下一张"
                >
                  <ChevronRight className="size-9 stroke-[2.75px]" />
                </button>
              </div>
            ) : previewMode === "pc" ? (
              <DesktopMockup>
                <PreviewContent
                  containerRef={previewRef}
                  html={html}
                  styleTheme={styleTheme}
                  imgRadius={imgRadius}
                  activeThemeCss={activeThemeCss}
                  activeTheme={activeTheme}
                  onImageWidthChange={onImageWidthChange}
                />
              </DesktopMockup>
            ) : (
              <IPhoneMockup
                mode={previewMode}
                screenStyle={{
                  backgroundColor: wechatBackgroundStyle.backgroundColor,
                  backgroundImage: wechatBackgroundStyle.backgroundImage,
                  backgroundRepeat: wechatBackgroundStyle.backgroundRepeat,
                  backgroundSize: wechatBackgroundStyle.backgroundSize,
                  backgroundPosition: wechatBackgroundStyle.backgroundPosition,
                }}
              >
                <PreviewContent
                  containerRef={previewRef}
                  html={html}
                  styleTheme={styleTheme}
                  imgRadius={imgRadius}
                  activeThemeCss={activeThemeCss}
                  activeTheme={activeTheme}
                  onImageWidthChange={onImageWidthChange}
                />
              </IPhoneMockup>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
