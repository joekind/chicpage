"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Monitor,
  Smartphone,
  Columns,
  Sidebar,
  MessageCircle,
  Copy,
  Check,
  Download,
  Loader2,
  FileText,
  ChevronDown,
  Palette,
  Image as ImageIconLucide,
  Github,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/workspace/toolbar/export-button";
import {
  POSTER_THEMES,
  WECHAT_THEMES,
  POSTER_FONTS,
  type WechatTheme,
} from "@/lib/themes";
import type { PosterRatio } from "@/types";
import {
  getThemeBackgroundStyle,
  getThemeTextureLayer,
} from "@/lib/themes";

const POSTER_RATIO_OPTIONS: { value: PosterRatio; label: string }[] = [
  { value: "3:4", label: "3:4" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
];

interface TopNavProps {
  previewMode: "pc" | "app";
  setPreviewMode: (m: "pc" | "app") => void;
  layoutMode: "split" | "edit" | "preview";
  setLayoutMode: (m: "split" | "edit" | "preview") => void;
  styleTheme: "wechat" | "poster";
  setStyleTheme: (t: "wechat" | "poster") => void;
  wechatTheme: string;
  setWechatTheme: (t: string) => void;
  posterTheme: string;
  setPosterTheme: (t: string) => void;
  posterFont: string;
  setPosterFont: (f: string) => void;
  posterRatio: PosterRatio;
  setPosterRatio: (ratio: PosterRatio) => void;
  onCopy: () => void;
  copyStatus: "idle" | "success" | "error";
  previewRef: React.RefObject<HTMLDivElement | null>;
  onExportPoster: () => void;
  isExportingPoster: boolean;
  exportProgress?: { current: number; total: number };
  showWordCount: boolean;
  setShowWordCount: (show: boolean) => void;
}

export const TopNav = React.memo(({
  previewMode,
  setPreviewMode,
  layoutMode,
  setLayoutMode,
  styleTheme,
  setStyleTheme,
  wechatTheme,
  setWechatTheme,
  posterTheme,
  setPosterTheme,
  posterFont,
  setPosterFont,
  posterRatio,
  setPosterRatio,
  onCopy,
  copyStatus,
  previewRef,
  onExportPoster,
  isExportingPoster,
  exportProgress,
  showWordCount,
  setShowWordCount,
}: TopNavProps) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showFeedbackQr, setShowFeedbackQr] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);
  const fontPickerRef = useRef<HTMLDivElement>(null);
  const currentWechatTheme =
    WECHAT_THEMES.find((t) => t.id === wechatTheme) || WECHAT_THEMES[0];
  const currentPosterTheme =
    POSTER_THEMES.find((t) => t.id === posterTheme) || POSTER_THEMES[0];
  const currentTheme =
    styleTheme === "wechat" ? currentWechatTheme : currentPosterTheme;
  const currentFont = POSTER_FONTS.find((f) => f.id === posterFont) || POSTER_FONTS[0];

  // 点击外部关闭主题选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themePickerRef.current &&
        !themePickerRef.current.contains(event.target as Node)
      ) {
        setShowThemePicker(false);
      }
      if (
        fontPickerRef.current &&
        !fontPickerRef.current.contains(event.target as Node)
      ) {
        setShowFontPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowFeedbackQr(false);
      }
    };

    if (showFeedbackQr) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showFeedbackQr]);

  return (
    <>
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/72 backdrop-blur-xl px-4 py-3 md:px-7">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="size-8 object-contain"
              priority
            />
            <span className="text-xl font-display font-black uppercase tracking-tighter text-zinc-900">
              ChicPage
            </span>
          </Link>


          <div className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-1 h-10 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLayoutMode("edit")}
              title="纯编辑模式"
              className={cn(
                "size-8 rounded-xl transition-colors",
                layoutMode === "edit"
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-500 hover:bg-white hover:text-zinc-900",
              )}
            >
              <Sidebar className="size-4 rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLayoutMode("split")}
              title="分屏模式"
              className={cn(
                "size-8 rounded-xl transition-colors",
                layoutMode === "split"
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-500 hover:bg-white hover:text-zinc-900",
              )}
            >
              <Columns className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLayoutMode("preview")}
              title="纯预览模式"
              className={cn(
                "size-8 rounded-xl transition-colors ",
                layoutMode === "preview"
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-500 hover:bg-white hover:text-zinc-900",
              )}
            >
              <Sidebar className="size-4" />
            </Button>
          </div>

          <div className="mx-1 h-5 w-px bg-zinc-200 hidden md:block" />

          <Link
            href="https://github.com/joekind/chicpage"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3.5 text-[11px] font-black text-zinc-600 transition-all hover:bg-white hover:text-zinc-900"
          >
            <Github className="size-4" />
            GitHub
          </Link>

          <motion.div 
            layout 
            className="flex items-center gap-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-1 max-h-10 shrink-0"
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5 rounded-xl px-3 text-[11px] font-black transition-all",
                styleTheme === "wechat"
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-500 hover:bg-white hover:text-zinc-900",
              )}
              onClick={() => {
                setStyleTheme("wechat");
              }}
            >
              <MessageCircle className="size-4" />
              公众号
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 gap-1.5 rounded-xl px-3 text-[11px] font-black transition-all",
                styleTheme === "poster"
                  ? "bg-zinc-200 text-zinc-900 "
                  : "text-zinc-500 hover:bg-white hover:text-zinc-900",
              )}
              onClick={() => {
                setStyleTheme("poster");
              }}
            >
              <ImageIconLucide className="size-4" />
              贴图
            </Button>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end shrink-0">

          <AnimatePresence mode="popLayout">
            {styleTheme === "poster" && (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-1 h-10"
              >
                {POSTER_RATIO_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    title={`切换到 ${option.label} 比例`}
                    onClick={() => setPosterRatio(option.value)}
                    className={cn(
                      "rounded-xl px-3 text-[11px] font-bold transition-all",
                      posterRatio === option.value
                        ? "bg-zinc-200 text-zinc-900 "
                        : "text-zinc-500 hover:bg-white hover:text-zinc-900",
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative" ref={themePickerRef}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 min-w-[108px] justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 transition-all hover:bg-zinc-50 hover:border-zinc-300",
                showThemePicker ? "border-zinc-400 text-zinc-900" : "text-zinc-600",
              )}
              onClick={() => setShowThemePicker(!showThemePicker)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Palette
                  className={cn(
                    "size-3.5 shrink-0",
                    showThemePicker ? "text-zinc-900" : "text-zinc-500",
                  )}
                />
                <span className="truncate text-[12px] font-bold tracking-tight">
                  {currentTheme.name}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "size-3 shrink-0 text-zinc-400 transition-transform duration-200",
                  showThemePicker ? "rotate-180" : "",
                )}
              />
            </Button>

            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full right-0 z-50 mt-2 w-[252px] overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
                >
                  <div className="border-b border-zinc-100 px-3 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      {styleTheme === "wechat" ? "微信主题" : "贴图主题"}
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      {(styleTheme === "wechat" ? WECHAT_THEMES : POSTER_THEMES).map(
                        (theme) => {
                          const isActive =
                            (styleTheme === "wechat" ? wechatTheme : posterTheme) ===
                            theme.id;
                          const wechatThemeData =
                            !("background" in theme) ? (theme as WechatTheme) : null;
                          const posterThemeData =
                            "background" in theme ? (theme as (typeof POSTER_THEMES)[number]) : null;
                          const wechatThemeBackground =
                            wechatThemeData ? getThemeBackgroundStyle(wechatThemeData) : null;
                          const wechatTextureLayer =
                            wechatThemeData ? getThemeTextureLayer(wechatThemeData) : null;
                          const previewStyle =
                            posterThemeData
                              ? {
                                  backgroundColor: posterThemeData.background,
                                  backgroundImage: posterThemeData.backgroundImage,
                                  backgroundRepeat: posterThemeData.backgroundRepeat,
                                  backgroundSize: posterThemeData.backgroundSize,
                                  backgroundPosition: posterThemeData.backgroundPosition,
                                }
                              : {
                                  backgroundColor:
                                    wechatThemeBackground?.backgroundColor ?? "#fff",
                                };

                          return (
                            <button
                              key={theme.id}
                              onClick={() => {
                                if (styleTheme === "wechat") {
                                  setWechatTheme(theme.id);
                                } else {
                                  setPosterTheme(theme.id);
                                }
                                setShowThemePicker(false);
                              }}
                              className={cn(
                                "group relative flex flex-col items-center rounded-[14px] border p-1.5 text-center transition-all duration-200",
                                isActive
                                  ? "border-zinc-300 bg-white text-zinc-900 shadow-[0_6px_14px_rgba(15,23,42,0.05)]"
                                  : "border-transparent bg-transparent text-zinc-500 hover:border-zinc-200/90 hover:bg-zinc-50/70 hover:text-zinc-700",
                              )}
                            >
                              <div
                                className={cn(
                                  "relative mb-1.5 aspect-[0.78/1] w-full shrink-0 overflow-hidden rounded-[12px] border transition-all duration-200 group-hover:scale-[1.02]",
                                  isActive ? "border-zinc-300 shadow-sm" : "border-zinc-200/80",
                                )}
                                style={previewStyle}
                              >
                                {wechatTextureLayer && (
                                  <div
                                    aria-hidden="true"
                                    className="absolute inset-0"
                                    style={{
                                      backgroundImage: `url("${wechatTextureLayer.src}")`,
                                      backgroundSize: "cover",
                                      backgroundRepeat:
                                        wechatThemeData?.id === "linedpaper2" ? "repeat" : "no-repeat",
                                      backgroundPosition: "center top",
                                      opacity: wechatTextureLayer.opacity,
                                    }}
                                  />
                                )}
                                <div
                                  className="absolute left-2.5 top-2.5 z-[1] h-1.5 w-7 rounded-full opacity-20"
                                  style={{
                                    background: isActive ? "#18181b" : "#000",
                                  }}
                                />
                                <div className="absolute left-2.5 top-5.5 z-[1] h-0.5 w-8 rounded-full bg-zinc-300/60" />
                                <div className="absolute left-2.5 top-8 z-[1] h-0.5 w-6 rounded-full bg-zinc-300/45" />
                                <div className="absolute left-2.5 top-10.5 z-[1] h-0.5 w-7 rounded-full bg-zinc-300/35" />
                                <div className="absolute inset-x-0 bottom-0 z-[1] h-5 bg-gradient-to-t from-black/[0.03] to-transparent" />
                              </div>

                              <div className="w-full truncate text-[11px] font-semibold tracking-tight">
                                {theme.name}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {styleTheme === "poster" && (
            <div className="relative" ref={fontPickerRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                      "h-10 min-w-[92px] justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 transition-all hover:bg-zinc-50 hover:border-zinc-300",
                    showFontPicker ? "border-zinc-400 text-zinc-900" : "text-zinc-600",
                  )}
                  onClick={() => setShowFontPicker(!showFontPicker)}
                >
                  <span className="truncate text-[12px] font-bold tracking-tight">
                    {currentFont.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-3 shrink-0 text-zinc-400 transition-transform duration-200",
                      showFontPicker ? "rotate-180" : "",
                    )}
                  />
                </Button>

              <AnimatePresence>
                {showFontPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full right-0 z-50 mt-2 w-[272px] overflow-hidden rounded-[22px] border border-zinc-200/80 bg-[rgba(255,255,255,0.96)] shadow-[0_16px_34px_rgba(15,23,42,0.10)] backdrop-blur-xl"
                  >
                    <div className="border-b border-zinc-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.85),rgba(255,255,255,0.88))] px-4 py-3.5">
                      <h3 className="text-[11px] font-semibold tracking-[0.16em] text-zinc-400">
                        选择字体
                      </h3>
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        {POSTER_FONTS.map((font) => {
                          const isActive = posterFont === font.id;
                          return (
                            <button
                              key={font.id}
                              onClick={() => {
                                setPosterFont(font.id);
                                setShowFontPicker(false);
                              }}
                              className={cn(
                                "relative flex min-h-[56px] items-center justify-center rounded-[16px] border px-2.5 py-2 text-center transition-all duration-200",
                                isActive
                                  ? "border-zinc-300 bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f8_100%)] text-zinc-900 shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                                  : "border-transparent bg-white text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50/70",
                              )}
                              style={{ fontFamily: font.value }}
                            >
                              <span className="line-clamp-2 text-[13px] font-medium leading-[1.2]">{font.name}</span>
                              {isActive && (
                                <div className="absolute right-2 top-2 flex size-4.5 items-center justify-center rounded-full bg-zinc-900">
                                  <Check className="size-3 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {styleTheme !== "poster" && (
            <div className="flex items-center gap-0.5 rounded-xl border border-zinc-200 bg-zinc-50 p-1 h-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewMode("pc")}
                title="电脑端预览"
                className={cn(
                  "size-8 rounded-lg transition-colors",
                  previewMode === "pc"
                    ? "bg-zinc-200 text-zinc-900"
                    : "text-zinc-500 hover:bg-white hover:text-zinc-900",
                )}
              >
                <Monitor className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewMode("app")}
                title="手机端预览"
                className={cn(
                  "size-8 rounded-lg transition-colors",
                  previewMode === "app"
                    ? "bg-zinc-200 text-zinc-900"
                    : "text-zinc-500 hover:bg-white hover:text-zinc-900",
                )}
              >
                <Smartphone className="size-3.5" />
              </Button>
              <div className="mx-1 h-4 w-px bg-zinc-200" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowWordCount(!showWordCount)}
                title={showWordCount ? "隐藏字数信息" : "显示字数信息"}
                className={cn(
                  "size-8 rounded-lg transition-colors ",
                  showWordCount
                    ? "bg-zinc-200 text-zinc-900"
                    : "text-zinc-500 hover:bg-white hover:text-zinc-900",
                )}
              >
                <FileText className="size-3.5" />
              </Button>
            </div>
          )}

          {styleTheme === "poster" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowWordCount(!showWordCount)}
              title={showWordCount ? "隐藏字数信息" : "显示字数信息"}
              className={cn(
                "size-10 rounded-xl border border-zinc-200 bg-white transition-colors hover:bg-zinc-50 hover:border-zinc-300",
                showWordCount
                  ? "bg-zinc-200 text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900",
              )}
            >
              <FileText className="size-4" />
            </Button>
          )}

          <div className="h-5 w-px bg-zinc-200" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFeedbackQr(true)}
            className="h-10 gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-black text-zinc-600 transition-all hover:bg-white hover:text-zinc-900"
          >
            <MessageCircle className="size-4" />
            反馈
          </Button>

          <div className="h-5 w-px bg-zinc-200" />

          {styleTheme === "poster" ? (
            <Button
              onClick={onExportPoster}
              disabled={isExportingPoster}
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 min-w-[88px] gap-1.5 rounded-xl border border-zinc-200 px-3 text-xs font-bold transition-all",
                "relative flex items-center justify-center overflow-hidden text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <AnimatePresence mode="wait">
                {isExportingPoster ? (
                  <motion.div
                    key="exporting"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="h-10 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Loader2 className="size-3.5 animate-spin text-indigo-500" />
                    <span className="tabular-nums">
                      {exportProgress
                        ? `${exportProgress.current}/${exportProgress.total}`
                        : "导出中..."}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="h-10 flex items-center gap-2"
                  >
                    <Download className="size-3.5" />
                    <span>导出海报</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          ) : (
            <ExportButton
              previewRef={previewRef}
              styleTheme={styleTheme}
              activeWechatTheme={currentWechatTheme as WechatTheme}
            />
          )}

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className={cn(
                "h-10 min-w-[88px] rounded-xl border border-zinc-200 px-3 text-xs font-bold transition-all",
                copyStatus === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : copyStatus === "error"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "text-zinc-700 hover:bg-zinc-50",
              )}
            >
            <AnimatePresence mode="wait">
              {copyStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center text-emerald-600"
                >
                  <Check className="mr-1 size-3.5" />
                  已复制！
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center"
                >
                  <Copy className="mr-1 size-3.5" />
                  {styleTheme === "poster" ? "复制正文" : "复制 HTML"}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        </div>
      </div>
    </nav>

    <AnimatePresence>
      {showFeedbackQr && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-4"
          onClick={() => setShowFeedbackQr(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="w-full max-w-sm overflow-hidden rounded-[28px] border border-zinc-200 bg-[#faf9f5] p-5 shadow-[0_24px_80px_rgba(20,20,19,0.16)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                Feedback
              </div>
              <div className="mt-2 font-serif text-xl font-medium text-zinc-900">
                扫码关注 / 提交反馈
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">
                直接用微信扫码，即可关注并发消息反馈。
              </div>
            </div>
            <div className="rounded-[24px] bg-white p-4 ring-1 ring-[#e8e6dc]">
              <Image
                src="/6.png"
                alt="意见反馈二维码"
                width={520}
                height={520}
                className="h-auto w-full rounded-[18px] object-contain"
                priority
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFeedbackQr(false)}
              className="mt-4 h-10 w-full rounded-2xl bg-[#e8e6dc] text-[11px] font-black text-zinc-700 transition-all hover:bg-[#ddd9cd]"
            >
              关闭
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
});

TopNav.displayName = "TopNav";
