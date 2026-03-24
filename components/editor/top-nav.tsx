"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Monitor,
  Smartphone,
  Columns,
  Sidebar,
  MessageCircle,
  Sparkles,
  Copy,
  Check,
  Download,
  Loader2,
  FileText,
  ChevronDown,
  Palette,
  Layers,
  Zap,
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/editor/export-button";
import { ThemePicker } from "@/components/editor/theme-picker";
import { XHSThemePicker } from "@/components/editor/xhs-theme-picker";
import { XHS_THEMES } from "@/lib/xhs-themes";
import { WECHAT_THEMES } from "@/lib/themes";

interface TopNavProps {
  previewMode: 'pc' | 'app' | 'xhs';
  setPreviewMode: (m: 'pc' | 'app' | 'xhs') => void;
  layoutMode: 'split' | 'edit' | 'preview';
  setLayoutMode: (m: 'split' | 'edit' | 'preview') => void;
  styleTheme: 'wechat' | 'xhs';
  setStyleTheme: (t: 'wechat' | 'xhs') => void;
  wechatTheme: string;
  setWechatTheme: (t: string) => void;
  xhsTheme: string;
  setXHSTheme: (t: string) => void;
  onCopy: () => void;
  copyStatus: 'idle' | 'success' | 'error';
  previewRef: React.RefObject<HTMLDivElement | null>;
  markdown: string;
  onExportXHS: () => void;
  isExportingXHS: boolean;
  exportProgress?: { current: number; total: number };
  xhsMode?: 'long' | 'slide';
  setXHSMode?: (mode: 'long' | 'slide') => void;
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
  xhsTheme,
  setXHSTheme,
  onCopy,
  copyStatus,
  previewRef,
  markdown,
  onExportXHS,
  isExportingXHS,
  exportProgress,
  xhsMode = 'slide',
  setXHSMode,
  showWordCount,
  setShowWordCount,
}: TopNavProps) => {

  const [showThemePicker, setShowThemePicker] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);
  const currentWechatTheme = WECHAT_THEMES.find(t => t.id === wechatTheme) || WECHAT_THEMES[0];
  const currentXHSTheme = XHS_THEMES.find(t => t.id === xhsTheme) || XHS_THEMES[0];
  const currentTheme = styleTheme === 'wechat' ? currentWechatTheme : currentXHSTheme;

  // 点击外部关闭主题选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themePickerRef.current && !themePickerRef.current.contains(event.target as Node)) {
        setShowThemePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200/50 bg-white/60 px-6 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/wmremove-transformed.png" alt="ChicPage Logo" className="size-7 object-contain" />
          <h1 className="text-xl font-black tracking-tighter text-zinc-900">CHICPAGE</h1>
        </div>
        
        <div className="ml-4 flex items-center gap-0.5 rounded-xl bg-zinc-100/80 p-1 shadow-inner border border-zinc-200/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLayoutMode('edit')}
            className={cn("size-8 rounded-lg transition-all", layoutMode === 'edit' ? "bg-white text-indigo-500 shadow-md ring-1 ring-zinc-200/50" : "text-zinc-500 hover:text-zinc-900")}
          >
             <Sidebar className="size-4 rotate-180" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLayoutMode('split')}
            className={cn("size-8 rounded-lg transition-all", layoutMode === 'split' ? "bg-white text-indigo-500 shadow-md ring-1 ring-zinc-200/50" : "text-zinc-500 hover:text-zinc-900")}
          >
             <Columns className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLayoutMode('preview')}
            className={cn("size-8 rounded-lg transition-all", layoutMode === 'preview' ? "bg-white text-indigo-500 shadow-md ring-1 ring-zinc-200/50" : "text-zinc-500 hover:text-zinc-900")}
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
              styleTheme === 'wechat'
                ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/80"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-white/50"
            )}
            onClick={() => {
              setStyleTheme('wechat');
              if (previewMode === 'xhs') setPreviewMode('app');
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
              styleTheme === 'xhs'
                ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/80"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-white/50"
            )}
            onClick={() => {
              setStyleTheme('xhs');
              setPreviewMode('xhs');
            }}
          >
            <BookOpen className="size-4" />
            小红书
          </Button>
        </div>

        {/* 极简主题选择器 */}
        <div className="relative" ref={themePickerRef}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 gap-2 rounded-xl px-3 transition-all duration-200 border border-zinc-200/60 bg-white/50 hover:bg-white hover:border-zinc-300 shadow-sm",
              showThemePicker ? "bg-white border-zinc-400 ring-2 ring-zinc-100" : ""
            )}
            onClick={() => setShowThemePicker(!showThemePicker)}
          >
            <Palette className={cn("size-3.5", showThemePicker ? "text-indigo-500" : "text-zinc-500")} />
            <span className={cn(
              "text-[12px] font-bold tracking-tight",
              showThemePicker ? "text-zinc-900" : "text-zinc-600"
            )}>
              {currentTheme.name}
            </span>
            <ChevronDown className={cn(
              "size-3 text-zinc-400 transition-transform duration-200",
              showThemePicker ? "rotate-180" : ""
            )} />
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
                    {styleTheme === 'wechat' ? '微信主题' : '小红书主题'}
                  </h3>
                </div>

                <div className="p-2">
                  <div className="grid grid-cols-1 gap-1">
                    {(styleTheme === 'wechat' ? WECHAT_THEMES : XHS_THEMES).map(theme => {
                      const isActive = (styleTheme === 'wechat' ? wechatTheme : xhsTheme) === theme.id;
                      
                      return (
                        <button
                          key={theme.id}
                          onClick={() => {
                            if (styleTheme === 'wechat') {
                              setWechatTheme(theme.id);
                            } else {
                              setXHSTheme(theme.id);
                            }
                            setShowThemePicker(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group",
                            isActive
                              ? "bg-indigo-50/50 text-indigo-600"
                              : "hover:bg-zinc-50 text-zinc-600"
                          )}
                        >
                          <div 
                            className={cn(
                              "size-10 rounded-lg border border-zinc-200 overflow-hidden relative shrink-0 transition-transform group-hover:scale-105",
                              isActive ? "border-indigo-200 shadow-sm" : ""
                            )}
                            style={{ background: theme.preview || '#fff' }}
                          >
                            {/* Simple abstract preview */}
                            <div className="absolute top-2 left-2 w-4 h-1 rounded-full opacity-20" style={{ background: isActive ? '#6366f1' : '#000' }} />
                            <div className="absolute top-4 left-2 w-6 h-0.5 rounded-full bg-zinc-300/50" />
                            <div className="absolute top-5.5 left-2 w-5 h-0.5 rounded-full bg-zinc-300/50" />
                          </div>
                          
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-[13px] font-bold truncate">
                              {theme.name}
                            </div>
                            <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                              {theme.id === 'elegant' ? '典雅精致风格' : (theme.id === 'magazine' ? '时尚杂志排版' : '经典简约排版')}
                            </p>
                          </div>

                          {isActive && (
                            <div className="size-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
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
      </div>

      <div className="flex items-center gap-0.5 rounded-lg bg-zinc-100/50 p-0.5 border border-zinc-200/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPreviewMode('pc')}
          title="电脑端预览"
          className={cn(
            "size-7 rounded-md transition-all", 
            previewMode === 'pc' ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <Monitor className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPreviewMode('app')}
          title="手机端预览"
          className={cn(
            "size-7 rounded-md transition-all", 
            (previewMode === 'app' || previewMode === 'xhs') ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200" : "text-zinc-400 hover:text-zinc-600"
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
            showWordCount ? "bg-white text-indigo-500 shadow-sm ring-1 ring-zinc-200" : "text-zinc-400 hover:text-zinc-600"
          )}
        >
          <FileText className="size-3.5" />
        </Button>
      </div>


      <div className="flex items-center gap-3">
        <div className="h-4 w-[1px] bg-zinc-200" />
        
        {styleTheme === 'xhs' ? (
          <Button
            onClick={onExportXHS}
            disabled={isExportingXHS}
            variant="ghost"
            size="sm"
            className={cn(
              "h-9 gap-2 rounded-xl px-4 text-xs font-bold transition-all",
              "text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isExportingXHS
              ? <><Loader2 className="size-3.5 animate-spin" />{exportProgress ? `正在导出第 ${exportProgress.current}/${exportProgress.total} 页` : '导出中...'}</>
              : <><Download className="size-3.5" />导出</>
            }
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
            copyStatus === 'success' ? "bg-emerald-50 text-emerald-600" :
            copyStatus === 'error' ? "bg-red-50 text-red-600" :
            "text-zinc-600 hover:bg-zinc-100"
          )}
        >
          {copyStatus === 'success' ? <Check className="size-3.5 mr-1" /> : <Copy className="size-3.5 mr-1" />}
          {copyStatus === 'success' ? '已复制！' :
           copyStatus === 'error' ? '复制失败' :
           styleTheme === 'xhs' ? '复制正文' : '复制 HTML'}
        </Button>
      </div>
    </nav>
  );
};
