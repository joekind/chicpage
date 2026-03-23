"use client";

import React, { useState } from "react";
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
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/editor/export-button";
import { ThemePicker } from "@/components/editor/theme-picker";
import { XHSThemePicker } from "@/components/editor/xhs-theme-picker";
import { XHS_THEMES } from "@/lib/xhs-themes";

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
}: TopNavProps) => {
  const [showXHSThemePicker, setShowXHSThemePicker] = useState(false);
  const currentXHSTheme = XHS_THEMES.find(t => t.id === xhsTheme) || XHS_THEMES[0];

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200/50 bg-white/60 px-6 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div>
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
          <Sparkles className="size-4" />
          小红书
        </Button>

        {styleTheme === 'wechat' && (
          <>
            <div className="h-4 w-px bg-zinc-300 mx-1" />
            <ThemePicker value={wechatTheme} onChange={setWechatTheme} />
          </>
        )}

        {styleTheme === 'xhs' && (
          <>
            <div className="h-4 w-px bg-zinc-300 mx-1" />
            <ThemePicker value={xhsTheme} onChange={setXHSTheme} themes={XHS_THEMES} />
          </>
        )}
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
