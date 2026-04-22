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
import { POSTER_THEMES } from "@/lib/poster-themes";
import { WECHAT_THEMES, type WechatTheme } from "@/lib/themes";
import { POSTER_FONTS } from "@/lib/fonts";
import type { PosterRatio } from "@/types";

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

  return (
    <>
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur-xl px-4 py-3 md:px-6">
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


          <div className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-1 h-10">
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
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 h-10 text-[11px] font-black text-zinc-600 transition-all hover:bg-white hover:text-zinc-900"
          >
            <Github className="size-4" />
            GitHub
          </Link>

          <motion.div 
            layout 
            className="flex items-center gap-1 rounded-2xl border border-zinc-200 bg-zinc-50 p-1 max-h-10"
          >
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                " gap-2 rounded-xl px-4 text-[11px] font-black transition-all",
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
                "h-9 gap-2 rounded-xl px-4 text-[11px] font-black transition-all",
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

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">

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
                "h-10 min-w-[120px] justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 transition-all hover:bg-zinc-50 hover:border-zinc-300",
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
                  className="absolute top-full right-0 z-50 mt-2 w-[260px] overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                >
                  <div className="border-b border-zinc-100 bg-zinc-50/50 px-4 py-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      {styleTheme === "wechat" ? "微信主题" : "小红书主题"}
                    </h3>
                  </div>

                  <div className="p-2">
                    <div className="grid grid-cols-1 gap-1">
                      {(styleTheme === "wechat" ? WECHAT_THEMES : POSTER_THEMES).map(
                        (theme) => {
                          const isActive =
                            (styleTheme === "wechat" ? wechatTheme : posterTheme) ===
                            theme.id;
                          const posterThemeData =
                            "background" in theme ? (theme as (typeof POSTER_THEMES)[number]) : null;
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
                                  backgroundColor: theme.preview || "#fff",
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
                                "group flex items-center gap-3 rounded-xl p-2.5 transition-colors",
                                isActive
                                  ? "bg-zinc-100 text-zinc-900"
                                  : "text-zinc-600 hover:bg-zinc-50",
                              )}
                            >
                              <div
                                className={cn(
                                  "relative size-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 transition-transform group-hover:scale-105",
                                  isActive ? "border-zinc-300" : "",
                                )}
                                style={previewStyle}
                              >
                                <div
                                  className="absolute left-2 top-2 h-1 w-4 rounded-full opacity-20"
                                  style={{
                                    background: isActive ? "#18181b" : "#000",
                                  }}
                                />
                                <div className="absolute left-2 top-4 h-0.5 w-6 rounded-full bg-zinc-300/50" />
                                <div className="absolute left-2 top-5.5 h-0.5 w-5 rounded-full bg-zinc-300/50" />
                              </div>

                              <div className="min-w-0 flex-1 text-left">
                                <div className="truncate text-[13px] font-bold">
                                  {theme.name}
                                </div>
                                <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                                  {theme.description}
                                </p>
                              </div>

                              {isActive && (
                                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-900">
                                  <Check className="size-3 text-white" />
                                </div>
                              )}
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
                    "h-10 min-w-[100px] justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-3 transition-all hover:bg-zinc-50 hover:border-zinc-300",
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
                    className="absolute top-full right-0 z-50 mt-2 w-[200px] overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                  >
                    <div className="border-b border-zinc-100 bg-zinc-50/50 px-4 py-3">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                        选择字体
                      </h3>
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-1 gap-1">
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
                                "flex items-center justify-between rounded-xl p-2.5 transition-colors",
                                isActive
                                  ? "bg-zinc-100 text-zinc-900"
                                  : "text-zinc-600 hover:bg-zinc-50",
                              )}
                              style={{ fontFamily: font.value }}
                            >
                              <span className="text-[14px]">{font.name}</span>
                              {isActive && <Check className="size-4 text-zinc-900" />}
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

          {styleTheme === "poster" ? (
            <Button
              onClick={onExportPoster}
              disabled={isExportingPoster}
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 min-w-[100px] gap-2 rounded-xl border border-zinc-200 px-4 text-xs font-bold transition-all",
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
                "h-10 min-w-[100px] rounded-xl border border-zinc-200 px-4 text-xs font-bold transition-all",
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
    </>
  );
});
