"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { IPhoneMockup } from "./mockups/iphone-mockup";
import { DesktopMockup } from "./mockups/desktop-mockup";
import { XHSSlidePreview as PosterSlidePreview, XHSSlidePreviewMethods } from "./xhs-slide-preview";
import { PreviewContent } from "./preview-content";
import type { PosterTheme } from "@/lib/poster-themes";
import type { WechatTheme } from "@/lib/themes";

interface PreviewSectionProps {
  layoutMode: string;
  previewMode: string;
  styleTheme: string;
  html: string;
  activeThemeCss: string;
  activeTheme: WechatTheme;
  activePosterTheme: PosterTheme;
  posterFont: string;
  posterShowHeader: boolean;
  posterShowFooter: boolean;
  imgRadius: number;
  isUploading: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  posterSlideRef: React.RefObject<XHSSlidePreviewMethods | null>;
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
  posterShowHeader,
  posterShowFooter,
  imgRadius,
  isUploading,
  previewRef,
  posterSlideRef,
}: PreviewSectionProps) => {
  if (layoutMode === "edit") return null;

  const getWechatBackground = (theme: WechatTheme): string => {
    const bgMatch = theme.containerStyle.match(/(?:background|background-color):\s*(#[a-fA-F0-9]{3,6}|[a-z]+)/);
    return bgMatch ? bgMatch[1] : '#ffffff';
  };

  return (
    <motion.section
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "flex-1 overflow-y-auto bg-white/20 backdrop-blur-sm rounded-3xl border border-white/40 flex flex-col items-center justify-center p-4 no-scrollbar relative",
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
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-lg border border-zinc-100 text-[12px] font-semibold text-indigo-500"
          >
            <Loader2 className="size-3.5 animate-spin" />
            图片处理中...
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col pt-4">
        <div className="flex-1 flex items-center justify-center overflow-visible">
          <div
            className="origin-top transition-transform duration-500 ease-out"
            style={{
              transform:
                previewMode === "pc" ? "none" : "scale(0.9) translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            {styleTheme === "xhs" ? (
              previewMode === "pc" ? (
                <div
                  style={{
                    background: "#f0f0f0",
                    borderRadius: 12,
                    padding: "40px 60px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0,
                  }}
                >
                  {/* Browser top UI */}
                  <div
                    style={{
                      width: "100%",
                      background: "#fff",
                      borderRadius: "10px 10px 0 0",
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      borderBottom: "1px solid #e8e8e8",
                    }}
                  >
                    <div style={{ display: "flex", gap: 5 }}>
                      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                        <div
                          key={c}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: c,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "#f5f5f5",
                        borderRadius: 6,
                        height: 22,
                        marginLeft: 8,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#999" }}>
                        xiaohongshu.com
                      </span>
                    </div>
                  </div>
                  {/* Card */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "0 0 10px 10px",
                      padding: "24px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <PosterSlidePreview
                      ref={posterSlideRef}
                      html={html}
                      theme={activePosterTheme}
                      font={posterFont}
                      showHeader={posterShowHeader}
                      showFooter={posterShowFooter}
                      hideMockUI={true}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <IPhoneMockup
                    screenStyle={{ background: activePosterTheme.background }}
                    hideStatusBar={false}
                    showDynamicIsland={true}
                  >
                    <PosterSlidePreview
                      ref={posterSlideRef}
                      html={html}
                      theme={activePosterTheme}
                      font={posterFont}
                      showHeader={posterShowHeader}
                      showFooter={posterShowFooter}
                      hideMockUI={true}
                    />
                  </IPhoneMockup>

                  {/* External Navigation Arrows */}
                  <button
                    onClick={() => posterSlideRef.current?.goPrev()}
                    className="absolute left-[-60px] top-1/2 -translate-y-1/2 p-3 text-zinc-400 hover:text-zinc-800 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="size-8 stroke-[2.5px]" />
                  </button>
                  <button
                    onClick={() => posterSlideRef.current?.goNext()}
                    className="absolute right-[-60px] top-1/2 -translate-y-1/2 p-3 text-zinc-400 hover:text-zinc-800 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="size-8 stroke-[2.5px]" />
                  </button>
                </div>
              )
            ) : previewMode === "pc" ? (
              <DesktopMockup>
                <PreviewContent
                  containerRef={previewRef}
                  html={html}
                  styleTheme={styleTheme}
                  imgRadius={imgRadius}
                  activeThemeCss={activeThemeCss}
                />
              </DesktopMockup>
            ) : (
              <IPhoneMockup 
                mode={previewMode}
                screenStyle={{ background: getWechatBackground(activeTheme) }}
              >
                <PreviewContent
                  containerRef={previewRef}
                  html={html}
                  styleTheme={styleTheme}
                  imgRadius={imgRadius}
                  activeThemeCss={activeThemeCss}
                />
              </IPhoneMockup>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
