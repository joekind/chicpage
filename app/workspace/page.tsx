"use client";

import React, { useState, useRef, useEffect } from "react";
import TurndownService from "turndown";
import { markdownToHtml } from "@/lib/markdown";
import { getInlinedHtml, getWeChatHtml } from "@/lib/inline_style";
import { useStore } from "@/store/use-store";
import { getTheme } from "@/lib/themes";
import { getPosterTheme, POSTER_THEMES } from "@/lib/poster-themes";
import { POSTER_FONTS } from "@/lib/fonts";
import { storeImageLocally } from "@/lib/image_service";
import { exportToImage } from "@/lib/export-image";
import { injectReadInfo, getCleanText } from "@/lib/utils-content";
import JSZip from "jszip";

import type { EditorMethods } from "@/components/editor/mdx-editor";
import { TopNav } from "@/components/editor/top-nav";
import { ContextMenu } from "@/components/editor/context-menu";
import type { SlidePreviewMethods } from "@/types";
import { AnimatePresence } from "framer-motion";
import { getXHSContentCSS } from "@/components/editor/xhs-slide-preview";
import { EditorSection } from "@/components/editor/editor-section";
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar";
import { PreviewSection } from "@/components/editor/preview-section";
import { ExportPreviewDialog } from "@/components/editor/export-preview-dialog";
import { FloatingToolbar } from "@/components/editor/floating-toolbar";
import type { SelectionInfo } from "@/components/editor/mdx-editor";

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
    posterTheme,
    setPosterTheme,
    posterFont,
    setPosterFont,
    layoutMode,
    setLayoutMode,
    posterShowHeader,
    posterShowFooter,
    showWordCount,
    setShowWordCount,
    undo,
    redo,
    pushHistory,
  } = useStore();

  const activeTheme = getTheme(wechatTheme);
  const activePosterTheme = getPosterTheme(posterTheme);
  const editorRef = useRef<EditorMethods>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const posterSlideRef = useRef<SlidePreviewMethods>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isExportingPoster, setIsExportingPoster] = useState(false);
  const [exportProgress, setExportProgress] = useState<
    { current: number; total: number } | undefined
  >(undefined);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<
    { html: string; index: number; totalInGroup: number; pageInGroup: number }[]
  >([]);
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [selectionCoords, setSelectionCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

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

  const handleInsertPageBreak = () => {
    handleInsertText("\n\n<!--pagebreak-->\n\n");
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
    }, 150);
    return () => clearTimeout(timer);
  }, [markdown, styleTheme, showWordCount, setHtml]);

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!cmdOrCtrl) return;

      // Ctrl/Cmd + S - 复制到剪贴板
      if (e.key === "s") {
        e.preventDefault();
        handleCopy();
        return;
      }

      // Ctrl/Cmd + / - 切换预览模式
      if (e.key === "/") {
        e.preventDefault();
        if (layoutMode === "edit") {
          setLayoutMode("preview");
        } else if (layoutMode === "preview") {
          setLayoutMode("split");
        } else {
          setLayoutMode("edit");
        }
        return;
      }

      // Ctrl/Cmd + Shift + P - 切换 PC/移动端预览
      if (e.shiftKey && e.key === "P") {
        e.preventDefault();
        setPreviewMode(previewMode === "pc" ? "app" : "pc");
        return;
      }

      // Ctrl/Cmd + Z - 撤销
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        if (editorRef.current) {
          const historyState = editorRef.current.getMarkdown();
          setMarkdown(historyState);
          editorRef.current.setMarkdown(historyState);
        }
        return;
      }

      // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y - 重做
      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
        if (editorRef.current) {
          const historyState = editorRef.current.getMarkdown();
          setMarkdown(historyState);
          editorRef.current.setMarkdown(historyState);
        }
        return;
      }

      // Ctrl/Cmd + B - 加粗
      if (e.key === "b") {
        e.preventDefault();
        if (styleTheme === "poster") {
          handleWrapText("「", "」");
        } else {
          handleWrapText("**");
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [layoutMode, previewMode, styleTheme, undo, redo]);

  const handleSelectionChange = (info: SelectionInfo) => {
    setSelection(info);
    if (!info.empty) {
      setTimeout(() => {
        const coords = editorRef.current?.getSelectionCoords();
        if (coords) setSelectionCoords(coords);
      }, 0);
    } else {
      setSelectionCoords(null);
    }
  };

  const handleCopy = async () => {
    try {
      if (styleTheme === "poster") {
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

  const handleExportPoster = async () => {
    if (!posterSlideRef.current) return;

    // 直接从幻灯片组件获取带分页信息的列表
    const allSlides = posterSlideRef.current.getSlides();
    const slidesForPreview = allSlides.map((s, i) => ({
      html: s.html,
      index: i,
      totalInGroup: s.totalInGroup,
      pageInGroup: s.pageInGroup
    }));

    setPreviewSlides(slidesForPreview);
    setShowExportPreview(true);
  };

  const handleConfirmExport = async () => {
    if (!posterSlideRef.current) return;
    setIsExportingPoster(true);
    setExportProgress({ current: 0, total: 0 });
    try {
      const totalSlides = posterSlideRef.current.getSlidesCount();
      setExportProgress({ current: 0, total: totalSlides });
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);

      const slidePages = Array.from(
        document.querySelectorAll(".xhs-slide-page"),
      ) as HTMLElement[];

      if (slidePages.length < totalSlides) {
        throw new Error(
          `导出失败：页面节点不足（${slidePages.length}/${totalSlides}）`,
        );
      }

      const validResults: { filename: string; dataUrl: string; base64Data: string }[] = [];
      for (let i = 0; i < totalSlides; i++) {
        const slidePage = slidePages[i];
        const dataUrl = (await exportToImage(slidePage as HTMLElement, {
          filename: `xhs-${timestamp}-${i + 1}-of-${totalSlides}`,
          format: "png",
          scale: 3,
          backgroundColor: activePosterTheme.background,
          returnDataUrl: true,
        })) as string;

        if (dataUrl) {
          const filename = `xhs-${timestamp}-${i + 1}-of-${totalSlides}.png`;
          validResults.push({ filename, dataUrl, base64Data: dataUrl.split(",")[1] });
        }
        setExportProgress({ current: i + 1, total: totalSlides });
      }

      const zip = new JSZip();
      validResults.forEach((result) => {
        zip.file(result.filename, result.base64Data, { base64: true });
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `xhs-export-${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExportingPoster(false);
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
        posterTheme={posterTheme}
        setPosterTheme={setPosterTheme}
        posterFont={posterFont}
        setPosterFont={setPosterFont}
        onCopy={handleCopy}
        copyStatus={copyStatus}
        previewRef={previewRef}
        markdown={markdown}
        onExportPoster={handleExportPoster}
        isExportingPoster={isExportingPoster}
        exportProgress={exportProgress}
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
            onPushHistory={pushHistory}
            floatingToolbar={
              <FloatingToolbar
                isVisible={!!selection && !selection.empty}
                coords={selectionCoords}
                onWrapText={handleWrapText}
                onBold={() => {
                  if (styleTheme === "poster") handleWrapText("「", "」");
                  else handleWrapText("**");
                }}
              />
            }
            toolbar={
              layoutMode !== "preview" && (
                <MarkdownToolbar
                  onWrapText={handleWrapText}
                  onInsertText={handleInsertText}
                  onInsertAtLineStart={handleInsertAtLineStart}
                  onApplyPangu={applyPangu}
                  onInsertTable={handleInsertTable}
                  onHeading={(level: 1 | 2) => {
                    if (styleTheme === "poster") {
                      if (level === 1)
                        handleInsertText("\n✨ 在这输入标题 ✨\n━━━━━━━\n");
                      else handleInsertText("\n📍 ");
                    } else {
                      handleInsertAtLineStart(level === 1 ? "# " : "## ");
                    }
                  }}
                  onBold={() => {
                    if (styleTheme === "poster") handleWrapText("「", "」");
                    else handleWrapText("**");
                  }}
                  onSeparator={() => {
                    if (styleTheme === "poster")
                      handleInsertText("\n" + "━".repeat(15) + "\n");
                    else handleInsertText("\n\n---\n\n");
                  }}
                  onInsertPageBreak={handleInsertPageBreak}
                  onQuote={() => {
                    if (styleTheme === "poster") handleInsertText("\n✅ ");
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
            onSelectionChange={handleSelectionChange}
            onInsertPageBreak={handleInsertPageBreak}
          />

          <PreviewSection
            key="preview"
            layoutMode={layoutMode}
            previewMode={previewMode}
            styleTheme={styleTheme}
            html={html}
            activeThemeCss={activeTheme.css}
            activeTheme={activeTheme}
            activePosterTheme={activePosterTheme}
            posterFont={posterFont}
            posterShowHeader={posterShowHeader}
            posterShowFooter={posterShowFooter}
            imgRadius={imgRadius}
            isUploading={isUploading}
            previewRef={previewRef}
            posterSlideRef={posterSlideRef}
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
            if (styleTheme === "poster") {
              handleInsertText("\n✨ 在这输入标题 ✨\n━━━━━━━\n");
            } else {
              handleInsertAtLineStart("# ");
            }
          }}
          onInsertSeparator={() => {
            if (styleTheme === "poster") {
              handleInsertText("\n" + "━".repeat(15) + "\n");
            } else {
              handleInsertText("\n\n---\n\n");
            }
          }}
          onInsertPageBreak={handleInsertPageBreak}
          separatorLabel={styleTheme === "poster" ? "插入装饰分隔线" : "插入分隔线"}
          pageBreakLabel="插入强制分页符（<!--pagebreak-->）"
          targetSelector=".mdx-editor-container"
          onDeleteLine={() => editorRef.current?.insertMarkdown("\n")}
        />
      </AnimatePresence>

      <ExportPreviewDialog
        isOpen={showExportPreview}
        onClose={() => setShowExportPreview(false)}
        onConfirm={handleConfirmExport}
        slides={previewSlides}
        themeBackground={activePosterTheme.background}
        themeCSS={getXHSContentCSS(
          activePosterTheme.css,
          POSTER_FONTS.find((f) => f.id === posterFont)?.value || POSTER_FONTS[0].value,
        )}
      />
    </div>
  );
}
