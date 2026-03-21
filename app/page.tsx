"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { markdownToHtml } from "@/lib/markdown";
import { getInlinedHtml, getWeChatHtml } from "@/lib/inline_style";
import { useStore } from "@/store/use-store";
import { getTheme } from "@/lib/themes";
import { uploadToCloud } from "@/lib/image_service";
import dynamic from "next/dynamic";
import type { EditorMethods } from "@/components/editor/mdx-editor";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Layers, Loader2 } from "lucide-react";

import { TopNav } from "@/components/editor/top-nav";
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar";
import { XHSScreenMockup } from "@/components/editor/mockups/xhs-mockup";
import { IPhoneMockup } from "@/components/editor/mockups/iphone-mockup";
import { DesktopMockup } from "@/components/editor/mockups/desktop-mockup";
import { ContextMenu } from "@/components/editor/context-menu";

const MDXEditor = dynamic(() => import("@/components/editor/mdx-editor"), { ssr: false });

export default function ChicEditor() {
  const {
    markdown, setMarkdown,
    references, setReferences,
    html, setHtml,
    previewMode, setPreviewMode,
    imgRadius,
    styleTheme, setStyleTheme,
    wechatTheme, setWechatTheme,
    layoutMode, setLayoutMode,
    undo, redo, pushHistory
  } = useStore();

  const activeTheme = getTheme(wechatTheme);
  const editorRef = useRef<EditorMethods>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // store hydrate 后同步到编辑器（解决 dynamic import + persist 时序问题）
  const hasHydrated = useRef(false);
  useEffect(() => {
    if (hasHydrated.current) return;
    if (markdown && editorRef.current) {
      editorRef.current.setMarkdown(markdown);
      hasHydrated.current = true;
    }
  }, [markdown]);

  // 在光标处插入/包裹文本
  const handleWrapText = (before: string, after?: string) => {
    editorRef.current?.wrapSelection(before, after ?? before);
  };

  const handleInsertText = (text: string) => {
    editorRef.current?.insertMarkdown(text);
  };

  const handleInsertAtLineStart = (prefix: string) => {
    editorRef.current?.insertAtLineStart(prefix);
  };

  const handleInsertTable = (rows: number, cols: number) => {
    const header = '| ' + Array(cols).fill('标题').join(' | ') + ' |';
    const divider = '| ' + Array(cols).fill('---').join(' | ') + ' |';
    const row = '| ' + Array(cols).fill('内容').join(' | ') + ' |';
    const table = '\n' + [header, divider, ...Array(rows).fill(row)].join('\n') + '\n';
    editorRef.current?.insertMarkdown(table);
    setActivePopup(null);
  };

  const applyPangu = () => {
    pushHistory();
    const text = editorRef.current?.getMarkdown() || markdown;
    const processed = text.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2').replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
    setMarkdown(processed);
    editorRef.current?.setMarkdown(processed);
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const cloudUrl = await uploadToCloud(file);
      console.log('✅ 上传成功:', cloudUrl);
      // 直接插入内联图片，URL 存在 markdown 里，persist 自然保存
      if (editorRef.current) {
        editorRef.current.insertMarkdown(`![${file.name}](${cloudUrl})`);
        setMarkdown(editorRef.current.getMarkdown());
      }
    } catch (err) {
      console.error('❌ 图片上传失败:', err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      let processed = markdown;
      const matches = processed.match(/!\[.*?\]\[img_[a-z0-9]+\]/g) || [];
      matches.forEach(tag => {
        const id = tag.match(/\[(img_[a-z0-9]+)\]/)?.[1];
        if (id) {
          const marker = `[${id}]: `;
          const idx = references.indexOf(marker);
          if (idx !== -1) {
            const data = references.substring(idx + marker.length).split('\n')[0].trim();
            const [url] = data.split('||');
            const alt = tag.match(/!\[(.*?)\]/)?.[1] || '';
            processed = processed.replace(tag, `![${alt}](${url})`);
          }
        }
      });
      if (styleTheme === 'xhs') {
        processed = processed.replace(/^# (.*)/gm, '<div class="xhs-h1">✨ $1 ✨</div>\n<div class="xhs-divider">━━━━━━━</div>').replace(/^## (.*)/gm, '<div class="xhs-h2">📍 $1</div>');
      }
      const res = await markdownToHtml(processed, references);
      setHtml(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [markdown, references, styleTheme, setHtml]);
  const handleCopy = async () => {
    if (!previewRef.current) return;
    try {
      const chicpageEl = previewRef.current.querySelector('#chicpage') as HTMLElement | null;
      const target = chicpageEl ?? previewRef.current;
      const contentHtml = getInlinedHtml(target, { wechatOptimized: true });
      const finalHtml = getWeChatHtml(contentHtml, activeTheme.containerStyle);
      const data = [new ClipboardItem({ "text/html": new Blob([finalHtml], { type: "text/html" }), "text/plain": new Blob([markdown], { type: "text/plain" }) })];
      await navigator.clipboard.write(data);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) { setCopyStatus('error'); }
  };

  const renderContent = () => (
    <div ref={previewRef} className={cn(
      "prose prose-zinc max-w-none transition-all duration-500", 
      styleTheme === 'xhs' ? "prose-sm xhs-card-theme" : "prose-base"
    )} style={{ '--img-radius': `${imgRadius}px` } as React.CSSProperties}>
      <style>{`
        ${styleTheme !== 'xhs' ? activeTheme.css : ''}
        .xhs-card-theme .xhs-h1 { color:var(--foreground); font-size:1.15rem; font-weight:900; text-align:center; margin:1.5rem 1rem 0.25rem; }
        .xhs-card-theme .xhs-divider { text-align:center; color:var(--border); font-size:0.8rem; margin-bottom:1.5rem; }
        .xhs-card-theme .xhs-h2 { color:var(--foreground); font-size:1.05rem; font-weight:800; margin:1.25rem 1rem 0.75rem; }
        .xhs-card-theme table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        .xhs-card-theme th { background: #f9f9f9; padding: 8px; border: 1px solid #eee; font-weight: 700; text-align: left; }
        .xhs-card-theme td { padding: 8px; border: 1px solid #eee; color: #444; }
      `}</style>
      <div id="chicpage" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-[#F9FAFB] overflow-hidden selection:bg-indigo-100 selection:text-indigo-900" onDragOver={(e) => e.preventDefault()}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-purple-200/50 blur-[100px]" />
      </div>
      <TopNav 
        previewMode={previewMode} 
        setPreviewMode={setPreviewMode} 
        layoutMode={layoutMode} 
        setLayoutMode={setLayoutMode} 
        styleTheme={styleTheme} 
        setStyleTheme={setStyleTheme} 
        wechatTheme={wechatTheme}
        setWechatTheme={setWechatTheme}
        onCopy={handleCopy} 
        copyStatus={copyStatus} 
        previewRef={previewRef} 
        markdown={markdown} 
      />
      
      <main className="flex flex-1 overflow-hidden relative p-4 gap-4">
        <motion.section 
          layout
          className={cn(
            "flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl floating-shadow border border-zinc-200/50 transition-all duration-500 overflow-hidden relative",
            layoutMode === 'split' ? "flex-1" : layoutMode === 'edit' ? "w-full max-w-4xl mx-auto" : "w-0 opacity-0 pointer-events-none p-0"
          )}
        >
          <MarkdownToolbar
            onWrapText={handleWrapText}
            onInsertText={handleInsertText}
            onInsertAtLineStart={handleInsertAtLineStart}
            onApplyPangu={applyPangu}
            onInsertTable={handleInsertTable}
            onInsertImage={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleImageFile(file);
              };
              input.click();
            }}
            isXHSTheme={styleTheme === 'xhs'}
            activePopup={activePopup}
            setActivePopup={setActivePopup}
          />
          <div 
            className="flex-1 overflow-y-auto relative flex flex-col no-scrollbar px-12 pb-20" 
            onDrop={(e) => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(handleImageFile); }}
            onPaste={(e) => {
              Array.from(e.clipboardData.items).forEach(item => {
                if (item.type.includes('image')) {
                  const file = item.getAsFile();
                  if (file) handleImageFile(file);
                }
              });
            }}
          >
            <MDXEditor ref={editorRef} markdown={markdown} onChange={setMarkdown} />
          </div>

          <div className="absolute bottom-6 left-8 flex items-center gap-4 bg-white/60 backdrop-blur-2xl px-4 py-2 rounded-2xl text-[10px] font-bold text-zinc-500 border border-zinc-100 shadow-lg">
            {isUploading && (
              <>
                <div className="flex items-center gap-2 text-indigo-500 animate-pulse">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Uploading Image...</span>
                </div>
                <div className="w-px h-3 bg-zinc-200" />
              </>
            )}
            <div className="flex items-center gap-2">
              <Type className="size-3" />
              <span>{markdown.length} 字符</span>
            </div>
            <div className="w-px h-3 bg-zinc-200" />
            <div className="flex items-center gap-2">
              <Layers className="size-3" />
              <span>约 {Math.ceil(markdown.length / 400)} 分钟阅读</span>
            </div>
          </div>
        </motion.section>

        <AnimatePresence>
          {layoutMode !== 'edit' && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "flex-1 overflow-y-auto bg-white/20 backdrop-blur-sm rounded-3xl border border-white/40 flex flex-col items-center justify-center p-8 no-scrollbar relative",
                layoutMode === 'preview' ? "w-full" : ""
              )}
            >
              {/* 上传状态提示 */}
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
                    图片上传中...
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-full max-w-5xl mx-auto h-full flex flex-col pt-8">
                <div className="flex-1 flex items-center justify-center overflow-visible">
                  <div className="origin-top transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: previewMode === 'pc' ? 'none' : 'scale(0.9)' }}>
                    {previewMode === 'pc' ? (
                      <DesktopMockup>{renderContent()}</DesktopMockup>
                    ) : (styleTheme === 'xhs' || previewMode === 'xhs') ? (
                      <XHSScreenMockup>{renderContent()}</XHSScreenMockup>
                    ) : (
                      <IPhoneMockup mode={previewMode}>{renderContent()}</IPhoneMockup>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
      <ContextMenu 
        onUndo={undo} 
        onRedo={redo} 
        onCopy={handleCopy} 
        onCut={() => document.execCommand('cut')} 
        onPaste={() => {}} 
        onInsertLink={() => {}} 
        onInsertImage={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleImageFile(file);
          };
          input.click();
        }} 
        onInsertHeading={() => editorRef.current?.insertMarkdown('\n# ')} 
        onInsertSeparator={() => editorRef.current?.insertMarkdown('\n---\n')} 
        onDeleteLine={() => editorRef.current?.insertMarkdown('\n')} 
      />
    </div>
  );
}
