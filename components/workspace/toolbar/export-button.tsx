"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileCode, FileLineChart, Check, XCircle } from "lucide-react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { getInlinedHtml, getWeChatHtml } from "@/lib/inline_style";
import { getLocalImage } from "@/lib/image_service";
import { useStore } from "@/store/use-store";
import type { WechatTheme } from "@/lib/themes";

interface ExportButtonProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  styleTheme: "wechat" | "poster";
  activeWechatTheme?: WechatTheme;
  fileName?: string;
}

export function ExportButton({
  previewRef,
  styleTheme,
  activeWechatTheme,
  fileName = "ChicPage",
}: ExportButtonProps) {
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!exportMenuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const downloadBlob = (blob: Blob, downloadName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const safeFileName = (name: string) =>
    name.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "-").replace(/^-+|-+$/g, "") || "ChicPage";

  const getTimestampedFileName = (name: string) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      pad(now.getMonth() + 1),
      pad(now.getDate()),
      "-",
      pad(now.getHours()),
      pad(now.getMinutes()),
      pad(now.getSeconds()),
    ].join("");

    return `${safeFileName(name)}-${timestamp}`;
  };

  const extensionFromMime = (mime: string) => {
    if (mime.includes("png")) return "png";
    if (mime.includes("webp")) return "webp";
    if (mime.includes("gif")) return "gif";
    if (mime.includes("svg")) return "svg";
    return "jpg";
  };

  const dataUrlToBlob = (dataUrl: string) => {
    const [meta, payload] = dataUrl.split(",");
    const mime = meta.match(/^data:([^;]+)/)?.[1] || "application/octet-stream";
    const bytes = meta.includes(";base64")
      ? atob(payload || "")
      : decodeURIComponent(payload || "");
    const array = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i += 1) array[i] = bytes.charCodeAt(i);
    return { blob: new Blob([array], { type: mime }), extension: extensionFromMime(mime) };
  };

  const getImageBlob = async (src: string) => {
    if (src.startsWith("data:")) {
      return dataUrlToBlob(src);
    }

    if (src.startsWith("img://")) {
      const dataUrl = await getLocalImage(src);
      return dataUrl ? dataUrlToBlob(dataUrl) : null;
    }

    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error("Image request failed");
      const blob = await res.blob();
      return { blob, extension: extensionFromMime(blob.type) };
    } catch {
      if (!/^https?:\/\//.test(src)) return null;
      try {
        const res = await fetch(`/api/image-proxy?url=${encodeURIComponent(src)}`);
        if (!res.ok) return null;
        const data = await res.json() as { dataUrl?: string };
        return data.dataUrl ? dataUrlToBlob(data.dataUrl) : null;
      } catch {
        return null;
      }
    }
  };

  const buildImageZip = async (imageSources: string[], rewrite: (src: string, assetPath: string) => void) => {
    const zip = new JSZip();
    const assetMap = new Map<string, string>();
    let imageCount = 0;

    for (const src of imageSources) {
      if (!src || assetMap.has(src)) continue;
      const image = await getImageBlob(src);
      if (!image) continue;

      imageCount += 1;
      const assetPath = `images/image-${String(imageCount).padStart(2, "0")}.${image.extension}`;
      assetMap.set(src, assetPath);
      zip.file(assetPath, image.blob);
      rewrite(src, assetPath);
    }

    if (imageCount === 0) return null;

    return zip;
  };

  const exportToHTML = async () => {
    if (!previewRef.current) return;
    try {
      const exportFileName = getTimestampedFileName(fileName);
      let htmlContent = previewRef.current.innerHTML;

      if (styleTheme === "wechat" && activeWechatTheme) {
        const chicpageEl = previewRef.current.querySelector("#chicpage") as HTMLElement | null;
        const target = chicpageEl ?? previewRef.current;
        const inlinedHtml = getInlinedHtml(target, { wechatOptimized: true });
        htmlContent = await getWeChatHtml(inlinedHtml, activeWechatTheme.containerStyle);
      }

      const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.8; max-width: 677px; margin: 0 auto; padding: 20px; }
    img { max-width: 100%; height: auto; display: block; margin: 1em auto; }
    pre, code { font-family: Consolas, "Courier New", monospace; background: #f5f5f5; padding: 1em; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ccc; padding-left: 16px; margin: 1em 0; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
      const doc = new DOMParser().parseFromString(fullHtml, "text/html");
      const imageSources = Array.from(doc.querySelectorAll<HTMLImageElement>("img"))
        .map((img) => img.getAttribute("src") || "")
        .filter(Boolean);
      const zip = await buildImageZip(imageSources, (src, assetPath) => {
        doc.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
          if (img.getAttribute("src") === src) img.setAttribute("src", assetPath);
        });
      });

      if (zip) {
        const rewrittenHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
        zip.file(`${exportFileName}.html`, rewrittenHtml);
        downloadBlob(await zip.generateAsync({ type: "blob" }), `${exportFileName}.zip`);
      } else {
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        downloadBlob(blob, `${exportFileName}.html`);
      }
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('HTML export failed:', error);
      setExportStatus('error');
    }
  };

  const exportToMarkdown = async () => {
    try {
      const exportFileName = getTimestampedFileName(fileName);
      let markdown = useStore.getState().markdown;
      const imageSources = Array.from(markdown.matchAll(/!\[([^\]\n]*)\]\((\S+?)(?:\s+(["'])(.*?)\3)?\)/g))
        .map((match) => match[2])
        .filter(Boolean);
      const zip = await buildImageZip(imageSources, (src, assetPath) => {
        markdown = markdown.replaceAll(src, assetPath);
      });

      if (zip) {
        zip.file(`${exportFileName}.md`, markdown);
        downloadBlob(await zip.generateAsync({ type: "blob" }), `${exportFileName}.zip`);
      } else {
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        downloadBlob(blob, `${exportFileName}.md`);
      }
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Markdown export failed:', error);
      setExportStatus('error');
    }
  };

  return (
    <div ref={exportMenuRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-10 gap-2 rounded-xl px-4 text-xs font-bold transition-all",
          isOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-100"
        )}
      >
        <Download className="size-3.5" />
        导出
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-zinc-200 bg-[#fbfaf7] shadow-[0_18px_50px_rgba(0,0,0,0.12)] overflow-hidden p-2"
            >
              <button
                onClick={async () => { await exportToHTML(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileCode className="size-4 text-blue-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span>导出 HTML</span>
                  <span className="text-[10px] text-zinc-400 font-normal">保持样式与图片</span>
                </div>
              </button>

              <button
                onClick={async () => { await exportToMarkdown(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <div className="size-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <FileLineChart className="size-4 text-purple-500" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span>导出 Markdown</span>
                  <span className="text-[10px] text-zinc-400 font-normal">包含图片资源</span>
                </div>
              </button>

              <AnimatePresence>
                {exportStatus !== 'idle' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      opacity: { duration: 0.2 }
                    }}
                    className="overflow-hidden"
                  >
                    <div className={cn(
                      "mt-2 px-3 py-2 rounded-xl text-[10px] font-bold text-center flex items-center justify-center gap-2",
                      exportStatus === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {exportStatus === 'success' ? (
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <Check className="size-3" /> 导出成功
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ x: -5 }}
                          animate={{ x: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 10 }}
                        >
                          <XCircle className="size-3" /> 导出失败
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
