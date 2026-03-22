"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { markdownToHtml } from "@/lib/markdown";
import { getInlinedHtml, getWeChatHtml } from "@/lib/inline_style";
import { useStore } from "@/store/use-store";
import { getTheme } from "@/lib/themes";
import { getXHSTheme } from "@/lib/xhs-themes";
import { uploadToCloud } from "@/lib/image_service";
import { exportToImage } from "@/lib/export-image";
import dynamic from "next/dynamic";
import type { EditorMethods } from "@/components/editor/mdx-editor";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Layers, Loader2 } from "lucide-react";

import { TopNav } from "@/components/editor/top-nav";
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar";
import { IPhoneMockup, StatusBar } from "@/components/editor/mockups/iphone-mockup";
import { DesktopMockup } from "@/components/editor/mockups/desktop-mockup";
import { ContextMenu } from "@/components/editor/context-menu";
import { XHSLongImagePreview } from "@/components/editor/xhs-long-image-preview";
import { XHSSlidePreview, XHSSlidePreviewMethods } from "@/components/editor/xhs-slide-preview";

const MDXEditor = dynamic(() => import("@/components/editor/mdx-editor"), { ssr: false });

export default function ChicEditor() {
  const {
    markdown, setMarkdown,
    references,
    html, setHtml,
    previewMode, setPreviewMode,
    imgRadius,
    styleTheme, setStyleTheme,
    wechatTheme, setWechatTheme,
    xhsTheme, setXHSTheme,
    layoutMode, setLayoutMode,
    xhsShowHeader, xhsShowFooter,
    undo, redo, pushHistory
  } = useStore();

  const activeTheme = getTheme(wechatTheme);
  const activeXHSTheme = getXHSTheme(xhsTheme);
  const editorRef = useRef<EditorMethods>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const xhsPreviewRef = useRef<HTMLDivElement>(null);
  const xhsSlideRef = useRef<XHSSlidePreviewMethods>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [isExportingXHS, setIsExportingXHS] = useState(false);
  const [xhsMode, setXHSMode] = useState<'long' | 'slide'>('slide');
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const hasHydrated = useRef(false);
  useEffect(() => {
    if (hasHydrated.current) return;
    if (markdown && editorRef.current) {
      editorRef.current.setMarkdown(markdown);
      hasHydrated.current = true;
    }
  }, [markdown]);

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
    } catch { setCopyStatus('error'); }
  };

  const handleExportXHS = async () => {
    if (!xhsSlideRef.current) return;
    
    setIsExportingXHS(true);
    try {
      const totalSlides = xhsSlideRef.current.getSlidesCount();
      const originalSlide = xhsSlideRef.current.getCurrentSlide();
      
      // 小红书卡片尺寸常量（与 xhs-slide-preview.tsx 保持一致）
      const CARD_W = 334;
      const CARD_H = 672;
      const FOOTER_H = 48;
      const PADDING_X = 20;
      const PADDING_Y = 24;
      const SAFE_MARGIN = 16; // 底部安全边距
      const CONTENT_H = CARD_H - FOOTER_H - PADDING_Y * 2 - SAFE_MARGIN; // 584px
      
      // 导出容器的实际高度（包含 padding + 额外的底部空间防止截断）
      const EXPORT_HEIGHT = CONTENT_H + PADDING_Y * 2 + 20; // 652px，额外增加 20px
      
      // 辅助函数：将图片转为 base64（使用服务端代理）
      const imgToBase64 = async (img: HTMLImageElement): Promise<string> => {
        // 如果已经是 base64，直接返回
        if (img.src.startsWith('data:')) {
          console.log('图片已是 base64 格式');
          return img.src;
        }
        
        try {
          // 使用服务端代理获取图片
          const url = new URL(img.src, window.location.href);
          console.log('通过服务端代理获取图片:', url.href);
          
          const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(url.href)}`);
          
          if (!response.ok) {
            throw new Error(`代理请求失败: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          if (data.dataUrl) {
            console.log('✓ 图片转换成功');
            return data.dataUrl;
          } else {
            throw new Error('代理返回数据格式错误');
          }
        } catch (e) {
          console.warn('服务端代理失败，尝试客户端转换:', e);
          
          // Fallback: 尝试客户端转换（可能因 CORS 失败）
          return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            if (!ctx) {
              console.warn('无法创建 canvas context');
              resolve(img.src);
              return;
            }
            
            // 如果图片已经加载完成，尝试直接转换
            if (img.complete && img.naturalWidth > 0) {
              try {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                console.log('✓ 客户端转换成功');
                resolve(dataUrl);
                return;
              } catch (err) {
                console.warn('✗ 客户端转换失败（CORS）:', err);
                resolve(img.src);
                return;
              }
            }
            
            // 尝试重新加载图片
            const image = new Image();
            image.crossOrigin = 'anonymous';
            
            const timeout = setTimeout(() => {
              console.warn('✗ 图片加载超时');
              resolve(img.src);
            }, 5000);
            
            image.onload = () => {
              clearTimeout(timeout);
              try {
                canvas.width = image.naturalWidth || image.width;
                canvas.height = image.naturalHeight || image.height;
                ctx.drawImage(image, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                console.log('✓ 重新加载并转换成功');
                resolve(dataUrl);
              } catch (err) {
                console.warn('✗ 转换失败:', err);
                resolve(img.src);
              }
            };
            
            image.onerror = () => {
              clearTimeout(timeout);
              console.warn('✗ 图片加载失败');
              resolve(img.src);
            };
            
            try {
              const url = new URL(img.src, window.location.href);
              image.src = url.href;
            } catch (err) {
              console.warn('URL 解析失败:', err);
              resolve(img.src);
            }
          });
        }
      };
      
      // 逐页导出
      for (let i = 0; i < totalSlides; i++) {
        xhsSlideRef.current.goToSlide(i);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 获取当前页的完整 slide 容器（包含 padding）
        const slideContainers = document.querySelectorAll('.xhs-slide-page');
        const slideContainer = slideContainers[i];
        if (!slideContainer) continue;
        
        // 创建离屏容器 - 与预览完全一致的结构
        const exportContainer = document.createElement('div');
        exportContainer.style.cssText = `
          position: fixed; top: -9999px; left: -9999px;
          width: ${CARD_W}px;
          height: ${CARD_H - FOOTER_H}px;
          background: ${activeXHSTheme.background};
          box-sizing: border-box;
          overflow: hidden;
        `;
        document.body.appendChild(exportContainer);

        // 注入主题样式
        const styleEl = document.createElement('style');
        styleEl.textContent = activeXHSTheme.css;
        exportContainer.appendChild(styleEl);
        
        // 克隆完整的 slide 容器（包含 padding）
        const slideClone = slideContainer.cloneNode(true) as HTMLElement;
        exportContainer.appendChild(slideClone);
        
        // 转换所有图片为 base64
        const images = exportContainer.querySelectorAll('img');
        console.log(`第 ${i + 1} 页找到 ${images.length} 张图片`);
        
        if (images.length > 0) {
          const results = await Promise.all(
            Array.from(images).map(async (img, idx) => {
              try {
                const originalSrc = img.src;
                const base64 = await imgToBase64(img as HTMLImageElement);
                (img as HTMLImageElement).src = base64;
                const success = base64.startsWith('data:');
                console.log(`图片 ${idx + 1}: ${success ? '✓ 转换成功' : '✗ 转换失败'}`);
                return success;
              } catch (e) {
                console.warn(`图片 ${idx + 1} 转换失败:`, e);
                return false;
              }
            })
          );
          
          const successCount = results.filter(r => r).length;
          console.log(`图片转换完成: ${successCount}/${images.length} 成功`);
          
          // 等待 DOM 更新
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // 注入内容样式
        const contentStyleEl = document.createElement('style');
        contentStyleEl.textContent = `
          #xhs-content {
            font-size: 15px;
            line-height: 1.8;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          #xhs-content > * {
            margin-bottom: 0.8em;
          }
          #xhs-content > *:last-child {
            margin-bottom: 0;
          }
          #xhs-content h1, #xhs-content h2, #xhs-content h3 {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            line-height: 1.4;
          }
          #xhs-content p {
            margin: 0.6em 0;
          }
          #xhs-content ul, #xhs-content ol {
            padding-left: 1.5em;
            margin: 0.6em 0;
          }
          #xhs-content li {
            margin: 0.3em 0;
          }
          #xhs-content img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 0.8em 0;
            border-radius: 8px;
          }
          #xhs-content pre {
            overflow-x: auto;
            padding: 12px;
            border-radius: 6px;
            margin: 0.8em 0;
            font-size: 13px;
          }
          #xhs-content code {
            font-size: 0.9em;
          }
          #xhs-content blockquote {
            margin: 0.8em 0;
            padding-left: 1em;
            border-left: 3px solid currentColor;
            opacity: 0.8;
          }
        `;
        exportContainer.appendChild(contentStyleEl);
        
        // 等待渲染完成
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 调试：输出容器实际高度
        console.log('导出容器尺寸:', {
          offsetHeight: exportContainer.offsetHeight,
          scrollHeight: exportContainer.scrollHeight,
          clientHeight: exportContainer.clientHeight,
          设定高度: EXPORT_HEIGHT
        });
        
        await exportToImage(exportContainer, {
          filename: `xhs-slide-${i + 1}-of-${totalSlides}`,
          format: 'png',
          scale: 3,
        });
        
        document.body.removeChild(exportContainer);
      }
      
      xhsSlideRef.current.goToSlide(originalSlide);
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setIsExportingXHS(false);
    }
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

  const renderXHSLongImage = () => (
    <XHSLongImagePreview
      ref={xhsPreviewRef}
      html={html}
      theme={activeXHSTheme}
      showHeader={xhsShowHeader}
      showFooter={xhsShowFooter}
    />
  );

  const renderXHSSlide = () => (
    <XHSSlidePreview
      ref={xhsSlideRef}
      html={html}
      theme={activeXHSTheme}
      showHeader={xhsShowHeader}
      showFooter={xhsShowFooter}
    />
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
        xhsTheme={xhsTheme}
        setXHSTheme={setXHSTheme}
        onCopy={handleCopy} 
        copyStatus={copyStatus} 
        previewRef={previewRef}
        markdown={markdown}
        onExportXHS={handleExportXHS}
        isExportingXHS={isExportingXHS}
        xhsMode={xhsMode}
        setXHSMode={setXHSMode}
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
                  <div className="origin-top transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: (previewMode === 'pc' || styleTheme === 'xhs') ? 'none' : 'scale(0.9)' }}>
                    {styleTheme === 'xhs' ? (
                      previewMode === 'pc' ? (
                        // 小红书 PC：浏览器外框 + 居中卡片
                        <div style={{ background: '#f0f0f0', borderRadius: 12, padding: '40px 60px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                          {/* 浏览器顶栏 */}
                          <div style={{ width: '100%', background: '#fff', borderRadius: '10px 10px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e8e8e8' }}>
                            <div style={{ display: 'flex', gap: 5 }}>
                              {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                            </div>
                            <div style={{ flex: 1, background: '#f5f5f5', borderRadius: 6, height: 22, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                              <span style={{ fontSize: 11, color: '#999' }}>xiaohongshu.com</span>
                            </div>
                          </div>
                          {/* 卡片 */}
                          <div style={{ background: '#fff', borderRadius: '0 0 10px 10px', padding: '24px', display: 'flex', justifyContent: 'center' }}>
                            <XHSSlidePreview
                              ref={xhsSlideRef}
                              html={html}
                              theme={activeXHSTheme}
                              showHeader={xhsShowHeader}
                              showFooter={xhsShowFooter}
                              hideMockUI={true}
                            />
                          </div>
                        </div>
                      ) : (
                         // 移动端：套手机壳
                         <div className="relative mx-auto overflow-hidden rounded-[55px] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl"
                           style={{ width: 350, height: 712 }}>
                           <div className="relative h-full w-full overflow-hidden rounded-[47px]" style={{ background: activeXHSTheme.background }}>
                             <div style={{ position: 'absolute', top: 0, left: 0, width: 334 }}>
                               <XHSSlidePreview
                                 ref={xhsSlideRef}
                                 html={html}
                                 theme={activeXHSTheme}
                                 showHeader={xhsShowHeader}
                                 showFooter={xhsShowFooter}
                                 hideMockUI={false}
                               />
                             </div>
                           </div>
                         </div>
                      )
                    ) : previewMode === 'pc' ? (
                      <DesktopMockup>{renderContent()}</DesktopMockup>
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
