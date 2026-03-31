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
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { CHANGELOG } from "@/lib/changelog";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/editor/export-button";
import { POSTER_THEMES } from "@/lib/poster-themes";
import { WECHAT_THEMES } from "@/lib/themes";
import { POSTER_FONTS } from "@/lib/fonts";

interface TopNavProps {
  previewMode: "pc" | "app" | "poster";
  setPreviewMode: (m: "pc" | "app" | "poster") => void;
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
  onCopy: () => void;
  copyStatus: "idle" | "success" | "error";
  previewRef: React.RefObject<HTMLDivElement | null>;
  markdown: string;
  onExportPoster: () => void;
  isExportingPoster: boolean;
  exportProgress?: { current: number; total: number };
  showWordCount: boolean;
  setShowWordCount: (show: boolean) => void;
}

export const TopNav = ({
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
  onCopy,
  copyStatus,
  previewRef,
  markdown,
  onExportPoster,
  isExportingPoster,
  exportProgress,
  showWordCount,
  setShowWordCount,
}: TopNavProps) => {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
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
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-900/10 bg-white px-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/wmremove-transformed.png"
            alt="Logo"
            width={32}
            height={32}
            className="size-8 object-contain"
            priority
          />
          <span className="text-xl font-display font-black tracking-tighter text-zinc-900 uppercase">
            ChicPage
          </span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowChangelog(true)}
          className="ml-4 gap-2 rounded-xl px-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
        >
          <History className="size-4" />
          <span className="text-xs font-bold">更新日志</span>
        </Button>

        <div className="ml-4 flex items-center p-1 border border-zinc-900/10 rounded-2xl bg-zinc-50 shadow-inner">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLayoutMode("edit")}
            title="纯编辑模式"
            className={cn(
              "size-8 rounded-xl transition-all",
              layoutMode === "edit"
                ? "bg-white text-indigo-500 shadow-md ring-1 ring-zinc-200/50"
                : "text-zinc-400 hover:text-zinc-900",
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
              "size-8 rounded-xl transition-all",
              layoutMode === "split"
                ? "bg-white text-indigo-500 shadow-md ring-1 ring-zinc-200/50"
                : "text-zinc-400 hover:text-zinc-900",
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
              "size-8 rounded-xl transition-all",
              layoutMode === "preview"
                ? "bg-white text-indigo-500 shadow-md ring-1 ring-zinc-200/50"
                : "text-zinc-400 hover:text-zinc-900",
            )}
          >
            <Sidebar className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-2xl bg-zinc-100/80 p-1 border border-zinc-200/50 shadow-inner">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 gap-2 rounded-xl px-4 text-[11px] font-black transition-all",
              styleTheme === "wechat"
                ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/80"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-white/50",
            )}
            onClick={() => {
              setStyleTheme("wechat");
              if (previewMode === "poster") setPreviewMode("app");
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
                ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/80"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-white/50",
            )}
            onClick={() => {
              setStyleTheme("poster");
              setPreviewMode("poster");
            }}
          >
            <ImageIconLucide className="size-4" />
            贴图
          </Button>
        </div>

        {/* 极简主题选择器 */}
        <div className="relative" ref={themePickerRef}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 gap-2 rounded-xl px-3 transition-all duration-200 border border-zinc-200/60 bg-white/50 hover:bg-white hover:border-zinc-300 shadow-sm",
              showThemePicker
                ? "bg-white border-zinc-400 ring-2 ring-zinc-100"
                : "",
            )}
            onClick={() => setShowThemePicker(!showThemePicker)}
          >
            <Palette
              className={cn(
                "size-3.5",
                showThemePicker ? "text-indigo-500" : "text-zinc-500",
              )}
            />
            <span
              className={cn(
                "text-[12px] font-bold tracking-tight",
                showThemePicker ? "text-zinc-900" : "text-zinc-600",
              )}
            >
              {currentTheme.name}
            </span>
            <ChevronDown
              className={cn(
                "size-3 text-zinc-400 transition-transform duration-200",
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
                className="absolute top-full right-0 mt-2 w-[260px] bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-zinc-200 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/30">
                  <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
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
                              "flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group",
                              isActive
                                ? "bg-indigo-50/50 text-indigo-600"
                                : "hover:bg-zinc-50 text-zinc-600",
                            )}
                          >
                            <div
                              className={cn(
                                "size-10 rounded-lg border border-zinc-200 overflow-hidden relative shrink-0 transition-transform group-hover:scale-105",
                                isActive ? "border-indigo-200 shadow-sm" : "",
                              )}
                              style={{ background: theme.preview || "#fff" }}
                            >
                              {/* Simple abstract preview */}
                              <div
                                className="absolute top-2 left-2 w-4 h-1 rounded-full opacity-20"
                                style={{
                                  background: isActive ? "#6366f1" : "#000",
                                }}
                              />
                              <div className="absolute top-4 left-2 w-6 h-0.5 rounded-full bg-zinc-300/50" />
                              <div className="absolute top-5.5 left-2 w-5 h-0.5 rounded-full bg-zinc-300/50" />
                            </div>

                            <div className="flex-1 text-left min-w-0">
                              <div className="text-[13px] font-bold truncate">
                                {theme.name}
                              </div>
                              <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                                {theme.description}
                              </p>
                            </div>

                            {isActive && (
                              <div className="size-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
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

        {/* 字体选择器 (仅小红书模式) */}
        {styleTheme === "poster" && (
          <div className="relative" ref={fontPickerRef}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 gap-2 rounded-xl px-3 transition-all duration-200 border border-zinc-200/60 bg-white/50 hover:bg-white hover:border-zinc-300 shadow-sm",
                showFontPicker
                  ? "bg-white border-zinc-400 ring-2 ring-zinc-100"
                  : "",
              )}
              onClick={() => setShowFontPicker(!showFontPicker)}
            >
              <span
                className={cn(
                  "text-[12px] font-bold tracking-tight",
                  showFontPicker ? "text-zinc-900" : "text-zinc-600",
                )}
              >
                {currentFont.name}
              </span>
              <ChevronDown
                className={cn(
                  "size-3 text-zinc-400 transition-transform duration-200",
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
                  className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-zinc-200 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/30">
                    <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
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
                              "flex items-center justify-between p-2.5 rounded-xl transition-all duration-200",
                              isActive
                                ? "bg-indigo-50/50 text-indigo-600"
                                : "hover:bg-zinc-50 text-zinc-600",
                            )}
                            style={{ fontFamily: font.value }}
                          >
                            <span className="text-[14px]">{font.name}</span>
                            {isActive && (
                              <Check className="size-4 text-indigo-500" />
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
      </div>

      <div className="flex items-center gap-0.5 rounded-lg bg-zinc-100/50 p-0.5 border border-zinc-200/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPreviewMode("pc")}
          title="电脑端预览"
          className={cn(
            "size-7 rounded-md transition-all",
            previewMode === "pc"
              ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
              : "text-zinc-400 hover:text-zinc-600",
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
            "size-7 rounded-md transition-all",
            previewMode === "app" || previewMode === "poster"
              ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
              : "text-zinc-400 hover:text-zinc-600",
          )}
        >
          <Smartphone className="size-3.5" />
        </Button>
        <div className="h-4 w-px bg-zinc-300 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowWordCount(!showWordCount)}
          title={showWordCount ? "隐藏字数信息" : "显示字数信息"}
          className={cn(
            "size-7 rounded-md transition-all",
            showWordCount
              ? "bg-white text-indigo-500 shadow-sm ring-1 ring-zinc-200"
              : "text-zinc-400 hover:text-zinc-600",
          )}
        >
          <FileText className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-4 w-[1px] bg-zinc-200" />

        {styleTheme === "poster" ? (
          <Button
            onClick={onExportPoster}
            disabled={isExportingPoster}
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 gap-2 rounded-xl px-4 text-xs font-bold transition-all",
              "text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {isExportingPoster ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                {exportProgress
                  ? `正在导出第 ${exportProgress.current}/${exportProgress.total} 页`
                  : "导出中..."}
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                导出
              </>
            )}
          </Button>
        ) : (
          <ExportButton previewRef={previewRef} markdown={markdown} />
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className={cn(
            "h-9 rounded-xl px-4 text-xs font-bold transition-all",
            copyStatus === "success"
              ? "bg-emerald-50 text-emerald-600"
              : copyStatus === "error"
                ? "bg-red-50 text-red-600"
                : "text-zinc-600 hover:bg-zinc-100",
          )}
        >
          {copyStatus === "success" ? (
            <Check className="size-3.5 mr-1" />
          ) : (
            <Copy className="size-3.5 mr-1" />
          )}
          {copyStatus === "success"
            ? "已复制！"
            : copyStatus === "error"
              ? "复制失败"
              : styleTheme === "poster"
                ? "复制正文"
                : "复制 HTML"}
        </Button>
      </div>

      {/* 更新日志对话框 */}
      <AnimatePresence>
        {showChangelog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowChangelog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <History className="size-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">更新日志</h2>
                    <p className="text-xs text-zinc-500">查看新功能和改进</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChangelog(false)}
                  className="size-8 rounded-lg hover:bg-zinc-100"
                >
                  <ChevronDown className="size-4 rotate-180" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] no-scrollbar scroll-smooth">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500 via-indigo-300 to-transparent" />

                  {/* Timeline items */}
                  <div className="space-y-6">
                    {CHANGELOG.map((entry, index) => (
                      <div key={index} className="relative flex gap-4">
                        <div className={cn(
                          "size-8 rounded-full flex items-center justify-center shrink-0 shadow-lg z-10",
                          index === 0 ? "bg-indigo-500 shadow-indigo-200" : "bg-zinc-200"
                        )}>
                          <span className={cn(
                            "text-xs font-bold",
                            index === 0 ? "text-white" : "text-zinc-500"
                          )}>
                            {index === 0 ? '今' : `v${CHANGELOG.length - index}`}
                          </span>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className={cn(
                            "text-xs font-semibold mb-1",
                            index === 0 ? "text-indigo-600" : "text-zinc-400"
                          )}>
                            {entry.date}
                          </div>
                          <h4 className="text-sm font-bold text-zinc-900 mb-2">{entry.title}</h4>
                          <ul className="space-y-1 text-xs text-zinc-600">
                            {entry.items.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">版本 1.0.0</span>
                  <Button
                    onClick={() => setShowChangelog(false)}
                    className="h-8 px-4 text-xs font-bold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
                  >
                    知道了
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
