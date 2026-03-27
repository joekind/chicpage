"use client";

import React, { useState, useRef, useEffect } from "react";
import TurndownService from "turndown";
import { cn } from "@/lib/utils";
import { markdownToHtml } from "@/lib/markdown";
import { getInlinedHtml, getWeChatHtml } from "@/lib/inline_style";
import { useStore } from "@/store/use-store";
import { getTheme } from "@/lib/themes";
import { getXHSTheme } from "@/lib/xhs-themes";
import { XHS_FONTS } from "@/lib/fonts";
import { storeImageLocally } from "@/lib/image_service";
import { exportToImage } from "@/lib/export-image";
import { injectReadInfo, getCleanText } from "@/lib/utils-content";
import JSZip from "jszip";

import dynamic from "next/dynamic";
import type { EditorMethods } from "@/components/editor/mdx-editor";
import { TopNav } from "@/components/editor/top-nav";
import { ContextMenu } from "@/components/editor/context-menu";
import { XHSSlidePreviewMethods } from "@/components/editor/xhs-slide-preview";
import { motion, AnimatePresence } from "framer-motion";
import {
  XHS_CARD_W,
  XHS_CARD_H,
  XHS_STATUS_H,
  XHS_FOOTER_H,
  XHS_CONTENT_H,
  getXHSContentCSS,
} from "@/components/editor/xhs-slide-preview";
import { EditorSection } from "@/components/editor/editor-section";
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar";
import { PreviewSection } from "@/components/editor/preview-section";
import { ExportPreviewDialog } from "@/components/editor/export-preview-dialog";

export default function ChicEditor() {
  const {
    markdown,
    setMarkdown,
    html,
    setHtml,
    previewMode,
    setPreviewMode,
    imgRadius,
    styleTheme,
    setStyleTheme,
    wechatTheme,
    setWechatTheme,
    xhsTheme,
    setXHSTheme,
    xhsFont,
    setXHSFont,
    layoutMode,
    setLayoutMode,
    xhsShowHeader,
    xhsShowFooter,
    showWordCount,
    setShowWordCount,
    undo,
    redo,
    pushHistory,
  } = useStore();

  const activeTheme = getTheme(wechatTheme);
  const activeXHSTheme = getXHSTheme(xhsTheme);
  const editorRef = useRef<EditorMethods>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const xhsSlideRef = useRef<XHSSlidePreviewMethods>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isExportingXHS, setIsExportingXHS] = useState(false);
  const [exportProgress, setExportProgress] = useState<
    { current: number; total: number } | undefined
  >(undefined);
  const [xhsMode, setXHSMode] = useState<"long" | "slide">("slide");
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<
    { html: string; index: number }[]
  >([]);

  const handlePaste = async (e: React.ClipboardEvent | ClipboardEvent) => {
    const clipboardData =
      (e as React.ClipboardEvent).clipboardData ||
      (e as ClipboardEvent).clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData("text/html");
    const items = Array.from(clipboardData.items);

    const imageItem = items.find((item) => item.type.includes("image"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) handleImageFile(file);
      return;
    }

    if (htmlData && !clipboardData.types.includes("Files")) {
      e.preventDefault();
      const turndown = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
        hr: "---",
      });
      turndown.keep(["kbd", "sup", "sub", "mark"]);
      const markdownContent = turndown.turndown(htmlData);
      if (editorRef.current) {
        editorRef.current.insertMarkdown(markdownContent);
        setMarkdown(editorRef.current.getMarkdown());
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        pushHistory();
        setMarkdown(content);
        if (editorRef.current) {
          editorRef.current.setMarkdown(content);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

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
    const header = "| " + Array(cols).fill("标题").join(" | ") + " |";
    const divider = "| " + Array(cols).fill("---").join(" | ") + " |";
    const row = "| " + Array(cols).fill("内容").join(" | ") + " |";
    const table =
      "\n" + [header, divider, ...Array(rows).fill(row)].join("\n") + "\n";
    editorRef.current?.insertMarkdown(table);
    setActivePopup(null);
  };

  const applyPangu = () => {
    pushHistory();
    const text = editorRef.current?.getMarkdown() || markdown;
    const processed = text
      .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, "$1 $2")
      .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, "$1 $2");
    setMarkdown(processed);
    editorRef.current?.setMarkdown(processed);
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const localUrl = await storeImageLocally(file);
      if (editorRef.current) {
        editorRef.current.insertMarkdown(`![${file.name}](${localUrl})`);
        setMarkdown(editorRef.current.getMarkdown());
      }
    } catch (err) {
      console.error("❌ 图片处理失败:", err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const contentToRender = showWordCount
        ? injectReadInfo(markdown)
        : markdown;
      const res = await markdownToHtml(contentToRender);
      setHtml(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [markdown, styleTheme, showWordCount, setHtml]);

  const handleCopy = async () => {
    try {
      if (styleTheme === "xhs") {
        // 小红书模式：一键复制纯正文，移除 Markdown 语法
        let textToCopy = showWordCount ? injectReadInfo(markdown) : markdown;
        textToCopy = getCleanText(textToCopy);
        await navigator.clipboard.writeText(textToCopy);
        setCopyStatus("success");
        setTimeout(() => setCopyStatus("idle"), 2000);
        return;
      }

      if (!previewRef.current) return;
      const chicpageEl = previewRef.current.querySelector(
        "#chicpage",
      ) as HTMLElement | null;
      const target = chicpageEl ?? previewRef.current;
      const contentHtml = getInlinedHtml(target, { wechatOptimized: true });
      const finalHtml = getWeChatHtml(contentHtml, activeTheme.containerStyle);
      const textToCopy = showWordCount ? injectReadInfo(markdown) : markdown;
      const data = [
        new ClipboardItem({
          "text/html": new Blob([finalHtml], { type: "text/html" }),
          "text/plain": new Blob([textToCopy], { type: "text/plain" }),
        }),
      ];
      await navigator.clipboard.write(data);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyStatus("error");
    }
  };

  const handleExportXHS = async () => {
    if (!xhsSlideRef.current) return;

    // 收集所有页面用于预览
    const totalSlides = xhsSlideRef.current.getSlidesCount();
    const slides: { html: string; index: number }[] = [];

    for (let i = 0; i < totalSlides; i++) {
      xhsSlideRef.current.goToSlide(i);
      await new Promise((resolve) => setTimeout(resolve, 100));
      const slidePages = document.querySelectorAll(".xhs-slide-page");
      const slidePage = slidePages[i];
      if (slidePage) {
        const content = slidePage.querySelector("#xhs-content");
        if (content) {
          slides.push({ html: content.innerHTML, index: i });
        }
      }
    }

    setPreviewSlides(slides);
    setShowExportPreview(true);
  };

  const handleConfirmExport = async () => {
    if (!xhsSlideRef.current) return;
    setIsExportingXHS(true);
    setExportProgress(undefined);
    try {
      const totalSlides = xhsSlideRef.current.getSlidesCount();
      const originalSlide = xhsSlideRef.current.getCurrentSlide();
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);

      // 并行处理所有页面的导出
      console.log("开始并行处理导出...");
      const exportPromises = [];

      for (let i = 0; i < totalSlides; i++) {
        const exportPromise = (async (slideIndex) => {
          // 跳转到对应页面
          xhsSlideRef.current?.goToSlide(slideIndex);
          // 等待页面渲染（进一步减少等待时间）
          await new Promise((resolve) =>
            setTimeout(resolve, slideIndex === 0 ? 300 : 100),
          );

          // 找到页面元素
          const slidePages = document.querySelectorAll(".xhs-slide-page");
          const slidePage = slidePages[slideIndex];
          if (!slidePage) {
            console.warn(`第 ${slideIndex + 1} 页：找不到 slidePage`);
            return null;
          }

          // 导出为图片（优化速度）
          const dataUrl = (await exportToImage(slidePage as HTMLElement, {
            filename: `xhs-${timestamp}-${slideIndex + 1}-of-${totalSlides}`,
            format: "png",
            scale: 8,
            backgroundColor: activeXHSTheme.background,
            returnDataUrl: true,
          })) as string;

          if (dataUrl) {
            const filename = `xhs-${timestamp}-${slideIndex + 1}-of-${totalSlides}.png`;
            return { filename, dataUrl, base64Data: dataUrl.split(",")[1] };
          }
          return null;
        })(i);

        exportPromises.push(exportPromise);
      }

      // 执行所有导出任务
      console.log("执行导出任务...");
      const results = await Promise.all(exportPromises);
      const validResults = results.filter((result) => result !== null);

      // 创建 ZIP 文件
      console.log("创建 ZIP 文件...");
      const zip = new JSZip();
      validResults.forEach((result) => {
        if (result) {
          zip.file(result.filename, result.base64Data, { base64: true });
        }
      });

      // 生成并下载 ZIP
      console.log("生成 ZIP 文件...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `xhs-export-${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);

      console.log("ZIP 文件下载完成！");
      xhsSlideRef.current.goToSlide(originalSlide);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExportingXHS(false);
      setExportProgress(undefined);
    }
  };

  return (
    <div
      className="flex h-screen flex-col bg-[#fcfcfc] overflow-hidden selection:bg-zinc-900 selection:text-white"
      onDragOver={(e) => e.preventDefault()}
    >
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
        xhsFont={xhsFont}
        setXHSFont={setXHSFont}
        onCopy={handleCopy}
        copyStatus={copyStatus}
        previewRef={previewRef}
        markdown={markdown}
        onExportXHS={handleExportXHS}
        isExportingXHS={isExportingXHS}
        exportProgress={exportProgress}
        xhsMode={xhsMode}
        setXHSMode={setXHSMode}
        showWordCount={showWordCount}
        setShowWordCount={setShowWordCount}
      />

      <main className="flex flex-1 overflow-hidden relative p-6 pt-4 gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          <EditorSection
            key="editor"
            layoutMode={layoutMode}
            markdown={markdown}
            setMarkdown={setMarkdown}
            editorRef={editorRef}
            onPaste={handlePaste}
            onFileUpload={handleFileUpload}
            onImageFile={handleImageFile}
            isUploading={isUploading}
            styleTheme={styleTheme}
            toolbar={
              layoutMode !== "preview" && (
                <MarkdownToolbar
                  onWrapText={handleWrapText}
                  onInsertText={handleInsertText}
                  onInsertAtLineStart={handleInsertAtLineStart}
                  onApplyPangu={applyPangu}
                  onInsertTable={handleInsertTable}
                  onHeading={(level: 1 | 2) => {
                    if (styleTheme === "xhs") {
                      if (level === 1)
                        handleInsertText("\n✨ 在这输入标题 ✨\n━━━━━━━\n");
                      else handleInsertText("\n📍 ");
                    } else {
                      handleInsertAtLineStart(level === 1 ? "# " : "## ");
                    }
                  }}
                  onBold={() => {
                    if (styleTheme === "xhs") handleWrapText("「", "」");
                    else handleWrapText("**");
                  }}
                  onSeparator={() => {
                    if (styleTheme === "xhs")
                      handleInsertText("\n" + "━".repeat(15) + "\n");
                    else handleInsertText("\n\n---\n\n");
                  }}
                  onQuote={() => {
                    if (styleTheme === "xhs") handleInsertText("\n✅ ");
                    else handleInsertAtLineStart("> ");
                  }}
                  onInsertImage={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleImageFile(file);
                    };
                    input.click();
                  }}
                  onImportMarkdown={() => {
                    const input = document.getElementById(
                      "md-import-input",
                    ) as HTMLInputElement;
                    input?.click();
                  }}
                  activePopup={activePopup}
                  setActivePopup={setActivePopup}
                />
              )
            }
          />

          <PreviewSection
            key="preview"
            layoutMode={layoutMode}
            previewMode={previewMode}
            styleTheme={styleTheme}
            html={html}
            activeThemeCss={activeTheme.css}
            activeXHSTheme={activeXHSTheme}
            xhsFont={xhsFont}
            xhsShowHeader={xhsShowHeader}
            xhsShowFooter={xhsShowFooter}
            imgRadius={imgRadius}
            isUploading={isUploading}
            previewRef={previewRef}
            xhsSlideRef={xhsSlideRef}
          />
        </AnimatePresence>
      </main>

      <AnimatePresence>
        <ContextMenu
          key="context-menu"
          onUndo={undo}
          onRedo={redo}
          onCopy={handleCopy}
          onCut={() => document.execCommand("cut")}
          onPaste={() => {}}
          onInsertLink={() => {}}
          onInsertImage={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleImageFile(file);
            };
            input.click();
          }}
          onInsertHeading={() => {
            if (styleTheme === "xhs") {
              handleInsertText("\n✨ 在这输入标题 ✨\n━━━━━━━\n");
            } else {
              handleInsertAtLineStart("# ");
            }
          }}
          onInsertSeparator={() => {
            if (styleTheme === "xhs") {
              handleInsertText("\n" + "━".repeat(15) + "\n");
            } else {
              handleInsertText("\n\n---\n\n");
            }
          }}
          onDeleteLine={() => editorRef.current?.insertMarkdown("\n")}
        />
      </AnimatePresence>

      <ExportPreviewDialog
        isOpen={showExportPreview}
        onClose={() => setShowExportPreview(false)}
        onConfirm={handleConfirmExport}
        slides={previewSlides}
        themeBackground={activeXHSTheme.background}
        themeCSS={getXHSContentCSS(
          activeXHSTheme.css,
          XHS_FONTS.find((f) => f.id === xhsFont)?.value || XHS_FONTS[0].value,
        )}
      />
    </div>
  );
}
