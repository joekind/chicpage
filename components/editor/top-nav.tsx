"use client";

import React from "react";
import {
  Monitor,
  Smartphone,
  Columns,
  Sidebar,
  MessageCircle,
  Sparkles,
  Copy,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/editor/export-button";
import { ThemePicker } from "@/components/editor/theme-picker";

interface TopNavProps {
  previewMode: 'pc' | 'app' | 'xhs';
  setPreviewMode: (m: 'pc' | 'app' | 'xhs') => void;
  layoutMode: 'split' | 'edit' | 'preview';
  setLayoutMode: (m: 'split' | 'edit' | 'preview') => void;
  styleTheme: 'wechat' | 'xhs';
  setStyleTheme: (t: 'wechat' | 'xhs') => void;
  wechatTheme: string;
  setWechatTheme: (t: string) => void;
  onCopy: () => void;
  copyStatus: 'idle' | 'success' | 'error';
  previewRef: React.RefObject<HTMLDivElement | null>;
  markdown: string;
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
  onCopy,
  copyStatus,
  previewRef,
  markdown,
}: TopNavProps) => {

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
              ? "bg-white text-emerald-600 shadow-md ring-1 ring-zinc-200/50" 
              : "text-zinc-500 hover:bg-white/50"
          )}
          onClick={() => {
            setStyleTheme('wechat');
            if (previewMode === 'xhs') setPreviewMode('app');
          }}
        >
          <MessageCircle className={cn("size-4", styleTheme === 'wechat' && "fill-emerald-600/10")} />
          公众号模式
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 gap-2 rounded-xl px-4 text-[11px] font-black transition-all",
            styleTheme === 'xhs' 
              ? "bg-white text-pink-600 shadow-md ring-1 ring-zinc-200/50" 
              : "text-zinc-500 hover:bg-white/50"
          )}
          onClick={() => {
            setStyleTheme('xhs');
            setPreviewMode('xhs');
          }}
        >
          <Sparkles className={cn("size-4", styleTheme === 'xhs' && "fill-pink-600/10")} />
          小红书模式
        </Button>

        {styleTheme === 'wechat' && (
          <>
            <div className="h-4 w-px bg-zinc-300 mx-1" />
            <ThemePicker value={wechatTheme} onChange={setWechatTheme} />
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
        <ExportButton previewRef={previewRef} markdown={markdown} />
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
