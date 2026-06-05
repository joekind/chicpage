'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import type { EditorMethods, SelectionInfo } from '@/components/workspace/editor/mdx-editor';
import {
  getPosterLayoutConfig,
  getXHSContentCSS,
  splitIntoSlides,
  type XHSSlidePreviewMethods,
} from '@/components/workspace/preview/xhs-slide-preview';
import { EXPORT } from '@/config/constants';
import { useEditorCommands } from '@/hooks/use-editor-commands';
import { useInsertLink } from '@/hooks/use-insert-link';
import { useMarkdownSync } from '@/hooks/use-markdown-sync';
import { useUploadNotice } from '@/hooks/use-upload-notice';
import { getCleanText, injectReadInfo } from '@/lib/content';
import { MARKDOWN_IMAGE_RE } from '@/lib/editor/commands';
import { exportToImage, getInlinedHtml, getWeChatHtml } from '@/lib/export';
import { getLocalImage } from '@/lib/images';
import { getPosterTheme, getTheme, getThemeBackgroundStyle, POSTER_FONTS } from '@/lib/themes';
import { useStore } from '@/store/use-store';
import type { CopyStatus } from '@/types';

type ExportStatus = 'idle' | 'success' | 'error';

function safeFileName(name: string) {
  return (
    name
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') || 'ChicPage'
  );
}

function getTimestampedFileName(name: string) {
  const pad = (value: number) => String(value).padStart(2, '0');
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    '-',
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('');

  return `${safeFileName(name)}-${timestamp}`;
}

function extensionFromMime(mime: string) {
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('gif')) return 'gif';
  if (mime.includes('svg')) return 'svg';
  return 'jpg';
}

function dataUrlToBlob(dataUrl: string) {
  const [meta, payload] = dataUrl.split(',');
  const mime = meta.match(/^data:([^;]+)/)?.[1] || 'application/octet-stream';
  const bytes = meta.includes(';base64') ? atob(payload || '') : decodeURIComponent(payload || '');
  const array = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i += 1) {
    array[i] = bytes.charCodeAt(i);
  }

  return {
    blob: new Blob([array], { type: mime }),
    extension: extensionFromMime(mime),
  };
}

/** 导出时内联图片的并发上限：批内并行、批间串行，平衡速度与资源占用 */
const IMAGE_INLINE_CONCURRENCY = 5;

function blobToDataUrl(blob: Blob): Promise<string | null> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
}

function downloadBlob(blob: Blob, downloadName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function createOffscreenWechatPreview(html: string, activeTheme: ReturnType<typeof getTheme>) {
  const root = document.createElement('div');
  root.style.cssText =
    'position:fixed;left:-10000px;top:0;width:677px;opacity:0;pointer-events:none;z-index:-1;letter-spacing:0;';

  const style = document.createElement('style');
  style.textContent = activeTheme.css;

  const themeShell = document.createElement('div');
  Object.assign(themeShell.style, getThemeBackgroundStyle(activeTheme), {
    width: '100%',
    maxWidth: '677px',
    margin: '0 auto',
    minHeight: '100%',
    padding: '0',
  });

  const content = document.createElement('div');
  content.id = 'chicpage';
  content.innerHTML = html;

  themeShell.appendChild(content);
  root.append(style, themeShell);
  document.body.appendChild(root);

  return {
    root,
    content,
    cleanup: () => {
      root.remove();
    },
  };
}

async function writeClipboardText(text: string) {
  const originalBodyTabIndex = document.body.getAttribute('tabindex');
  const activeElement = document.activeElement as HTMLElement | null;
  const restoreBodyFocusState = () => {
    if (originalBodyTabIndex === null) {
      document.body.removeAttribute('tabindex');
    } else {
      document.body.setAttribute('tabindex', originalBodyTabIndex);
    }
  };

  window.focus();
  if (typeof document.hasFocus === 'function' && !document.hasFocus()) {
    document.body.setAttribute('tabindex', '-1');
    document.body.focus({ preventScroll: true });
  }

  const copyViaCopyEvent = () => {
    const handleCopy = (event: ClipboardEvent) => {
      event.preventDefault();
      event.clipboardData?.setData('text/plain', text);
    };

    document.addEventListener('copy', handleCopy, { once: true });

    try {
      return document.execCommand('copy');
    } finally {
      document.removeEventListener('copy', handleCopy);
    }
  };

  const copyViaTextarea = () => {
    const textarea = document.createElement('textarea');

    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
      return document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  try {
    if (copyViaCopyEvent() || copyViaTextarea()) return;
    await navigator.clipboard.writeText(text);
    restoreBodyFocusState();
    return;
  } finally {
    activeElement?.focus?.();
    restoreBodyFocusState();
  }
}

export function useMobileWorkspaceController() {
  const {
    markdown,
    setMarkdown,
    html,
    setHtml,
    imgRadius,
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
    posterShowHeader,
    posterShowFooter,
    showWordCount,
    setShowWordCount,
    past,
    future,
    undo,
    redo,
    pushHistory,
  } = useStore(
    useShallow(state => ({
      markdown: state.markdown,
      setMarkdown: state.setMarkdown,
      html: state.html,
      setHtml: state.setHtml,
      imgRadius: state.imgRadius,
      styleTheme: state.styleTheme,
      setStyleTheme: state.setStyleTheme,
      wechatTheme: state.wechatTheme,
      setWechatTheme: state.setWechatTheme,
      posterTheme: state.posterTheme,
      setPosterTheme: state.setPosterTheme,
      posterFont: state.posterFont,
      setPosterFont: state.setPosterFont,
      posterRatio: state.posterRatio,
      setPosterRatio: state.setPosterRatio,
      posterShowHeader: state.posterShowHeader,
      posterShowFooter: state.posterShowFooter,
      showWordCount: state.showWordCount,
      setShowWordCount: state.setShowWordCount,
      past: state.past,
      future: state.future,
      undo: state.undo,
      redo: state.redo,
      pushHistory: state.pushHistory,
    })),
  );

  const activeTheme = useMemo(() => getTheme(wechatTheme), [wechatTheme]);
  const activePosterTheme = useMemo(() => getPosterTheme(posterTheme), [posterTheme]);
  const posterLayout = useMemo(
    () => getPosterLayoutConfig(posterRatio, posterShowFooter),
    [posterRatio, posterShowFooter],
  );
  const posterFontValue = useMemo(
    () => POSTER_FONTS.find(font => font.id === posterFont)?.value || POSTER_FONTS[0].value,
    [posterFont],
  );
  const posterThemeCSS = useMemo(
    () => getXHSContentCSS(activePosterTheme.css, posterFontValue, posterLayout),
    [activePosterTheme.css, posterFontValue, posterLayout],
  );

  const editorRef = useRef<EditorMethods>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const posterSlideRef = useRef<XHSSlidePreviewMethods>(null);
  const exportPreviewRef = useRef<HTMLDivElement>(null);

  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [isExportingPoster, setIsExportingPoster] = useState(false);
  const [exportProgress, setExportProgress] = useState<
    { current: number; total: number } | undefined
  >(undefined);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [previewSlides, setPreviewSlides] = useState<
    { html: string; index: number; totalInGroup: number; pageInGroup: number }[]
  >([]);

  const { isUploading, setIsUploading, uploadNotice, showUploadNotice } = useUploadNotice();

  const commands = useEditorCommands({
    editorRef,
    styleTheme,
    pushHistory,
    setMarkdown,
    undo,
    redo,
    setIsUploading,
    showUploadNotice,
  });

  const insertLink = useInsertLink({
    editorRef,
    pushHistory,
    setMarkdown,
    selection,
  });

  useMarkdownSync({
    markdown,
    styleTheme,
    showWordCount,
    onHtmlChange: setHtml,
  });

  const handleSelectionChange = useCallback((info: SelectionInfo) => {
    setSelection(info);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      const currentMarkdown = useStore.getState().markdown;

      // 贴图模式：复制移除 Markdown 语法的纯正文。
      if (styleTheme === 'poster') {
        const rawText = showWordCount ? injectReadInfo(currentMarkdown) : currentMarkdown;
        await writeClipboardText(getCleanText(rawText));
        setCopyStatus('success');
        setTimeout(() => setCopyStatus('idle'), 2000);
        return;
      }

      // 公众号模式：复制带内联样式的富文本 HTML，与桌面端对齐，直接粘贴到
      // 公众号编辑器即可保留排版。
      const plainText = showWordCount ? injectReadInfo(currentMarkdown) : currentMarkdown;

      // 编辑面板下可见预览未挂载，临时离屏渲染以便内联计算样式。
      let transientPreview: ReturnType<typeof createOffscreenWechatPreview> | null = null;
      let previewNode = previewRef.current;
      if (!previewNode) {
        transientPreview = createOffscreenWechatPreview(html, activeTheme);
        previewNode = transientPreview.root;
      }

      try {
        const chicpageEl =
          transientPreview?.content ??
          (previewNode.querySelector('#chicpage') as HTMLElement | null);
        const target = chicpageEl ?? previewNode;
        const contentHtml = getInlinedHtml(target, {
          wechatOptimized: true,
          imgRadius,
        });
        const finalHtml = await getWeChatHtml(contentHtml, activeTheme.containerStyle);

        // 优先复制富文本；移动端浏览器不支持 ClipboardItem 时回退纯文本。
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html': new Blob([finalHtml], { type: 'text/html' }),
              'text/plain': new Blob([plainText], { type: 'text/plain' }),
            }),
          ]);
        } catch {
          await writeClipboardText(plainText);
        }
      } finally {
        transientPreview?.cleanup();
      }

      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }, [styleTheme, showWordCount, html, imgRadius, activeTheme]);

  const getImageBlob = useCallback(async (src: string) => {
    if (src.startsWith('data:')) {
      return dataUrlToBlob(src);
    }

    if (src.startsWith('blob:')) {
      try {
        const response = await fetch(src);
        if (!response.ok) return null;
        const blob = await response.blob();
        return { blob, extension: extensionFromMime(blob.type) };
      } catch {
        return null;
      }
    }

    if (src.startsWith('img://')) {
      const dataUrl = await getLocalImage(src);
      return dataUrl ? dataUrlToBlob(dataUrl) : null;
    }

    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error('Image request failed');
      const blob = await response.blob();
      return { blob, extension: extensionFromMime(blob.type) };
    } catch {
      if (!/^https?:\/\//.test(src)) return null;

      try {
        const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(src)}`);
        if (!response.ok) return null;
        const data = (await response.json()) as { dataUrl?: string };
        return data.dataUrl ? dataUrlToBlob(data.dataUrl) : null;
      } catch {
        return null;
      }
    }
  }, []);

  // 将图片源批量转换为 data URL，用于导出时内联成「自包含的单文件」
  // （不再打包 zip），方便直接保存到手机文件管理器。data: 源已内联，跳过。
  const buildImageDataUrlMap = useCallback(
    async (imageSources: string[]) => {
      const dataUrlMap = new Map<string, string>();
      // 去重并过滤掉无需转换的源（空值、已是 data: URL）。
      const targets = [...new Set(imageSources.filter(src => src && !src.startsWith('data:')))];

      // 有限并发：每批至多 IMAGE_INLINE_CONCURRENCY 张并行，批与批之间串行，
      // 在导出提速与避免压垮 image-proxy / 浏览器并发连接数之间取平衡。
      for (let i = 0; i < targets.length; i += IMAGE_INLINE_CONCURRENCY) {
        const batch = targets.slice(i, i + IMAGE_INLINE_CONCURRENCY);
        const entries = await Promise.all(
          batch.map(async src => {
            const image = await getImageBlob(src);
            if (!image) return null;
            const dataUrl = await blobToDataUrl(image.blob);
            return dataUrl ? ([src, dataUrl] as const) : null;
          }),
        );

        for (const entry of entries) {
          if (entry) dataUrlMap.set(entry[0], entry[1]);
        }
      }

      return dataUrlMap;
    },
    [getImageBlob],
  );

  const handleExportHtml = useCallback(async () => {
    let transientPreview: ReturnType<typeof createOffscreenWechatPreview> | null = null;
    let previewNode = previewRef.current;

    if (!previewNode && styleTheme === 'wechat') {
      // Mobile edit mode unmounts the visible preview, but HTML export still
      // needs a real DOM node so computed styles can be inlined for WeChat.
      transientPreview = createOffscreenWechatPreview(html, activeTheme);
      previewNode = transientPreview.root;
    }

    if (!previewNode) return;

    try {
      const exportFileName = getTimestampedFileName('ChicPage');
      let htmlContent = previewNode.innerHTML;

      if (styleTheme === 'wechat') {
        const chicpageEl =
          transientPreview?.content ??
          (previewNode.querySelector('#chicpage') as HTMLElement | null);
        const target = chicpageEl ?? previewNode;
        const inlinedHtml = getInlinedHtml(target, {
          wechatOptimized: true,
          imgRadius,
        });
        htmlContent = await getWeChatHtml(inlinedHtml, activeTheme.containerStyle);
      }

      const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChicPage</title>
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

      const doc = new DOMParser().parseFromString(fullHtml, 'text/html');
      const imageElements = Array.from(doc.querySelectorAll('img'));
      const dataUrlMap = await buildImageDataUrlMap(
        imageElements.map(image => image.getAttribute('src') || ''),
      );

      imageElements.forEach(image => {
        const src = image.getAttribute('src');
        const dataUrl = src ? dataUrlMap.get(src) : undefined;
        if (dataUrl) image.setAttribute('src', dataUrl);
      });

      const finalHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
      downloadBlob(
        new Blob([finalHtml], { type: 'text/html;charset=utf-8' }),
        `${exportFileName}.html`,
      );

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('HTML export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2600);
    } finally {
      transientPreview?.cleanup();
    }
  }, [activeTheme, buildImageDataUrlMap, html, imgRadius, styleTheme]);

  const handleExportMarkdown = useCallback(async () => {
    try {
      const exportFileName = getTimestampedFileName('ChicPage');
      let currentMarkdown = useStore.getState().markdown;
      // 仅内联本地图片（img:// / blob:）；远程 http(s) 链接本身可移植，保持原样，
      // 避免 .md 体积膨胀。
      const localImageSources = Array.from(currentMarkdown.matchAll(MARKDOWN_IMAGE_RE))
        .map(match => match[2])
        .filter(
          (src): src is string =>
            Boolean(src) && (src.startsWith('img://') || src.startsWith('blob:')),
        );
      const dataUrlMap = await buildImageDataUrlMap(localImageSources);

      for (const [src, dataUrl] of dataUrlMap) {
        currentMarkdown = currentMarkdown.replaceAll(src, dataUrl);
      }

      downloadBlob(
        new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' }),
        `${exportFileName}.md`,
      );

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 2000);
    } catch (error) {
      console.error('Markdown export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2600);
    }
  }, [buildImageDataUrlMap]);

  const handleOpenPosterExportPreview = useCallback(async () => {
    try {
      const mountedSlides = posterSlideRef.current?.getSlides();
      const slides =
        mountedSlides && mountedSlides.length > 0
          ? mountedSlides
          : await splitIntoSlides(html, activePosterTheme.css, posterFontValue, posterLayout);

      setPreviewSlides(
        slides.map((slide, index) => ({
          html: slide.html,
          index,
          totalInGroup: slide.totalInGroup,
          pageInGroup: slide.pageInGroup,
        })),
      );
      setShowExportPreview(true);
    } catch (error) {
      console.error('Poster preview generation failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2600);
    }
  }, [activePosterTheme.css, html, posterFontValue, posterLayout]);

  const handleConfirmPosterExport = useCallback(async () => {
    setIsExportingPoster(true);
    setExportProgress({ current: 0, total: 0 });

    try {
      const totalSlides = previewSlides.length;
      if (totalSlides === 0) {
        throw new Error('导出失败：没有可导出的贴图页面');
      }

      setExportProgress({ current: 0, total: totalSlides });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const slidePages = Array.from(
        exportPreviewRef.current?.querySelectorAll('.mobile-xhs-export-page') ?? [],
      ) as HTMLElement[];

      if (slidePages.length < totalSlides) {
        throw new Error(`导出失败：页面节点不足（${slidePages.length}/${totalSlides}）`);
      }

      const validResults: {
        filename: string;
        blob: Blob;
      }[] = [];

      for (let i = 0; i < totalSlides; i += 1) {
        const slidePage = slidePages[i];
        const dataUrl = (await exportToImage(slidePage, {
          filename: `chicpage-${timestamp}-${i + 1}-of-${totalSlides}`,
          format: 'png',
          scale: EXPORT.DEFAULT_SCALE,
          backgroundColor: activePosterTheme.background,
          returnDataUrl: true,
        })) as string;

        if (dataUrl) {
          const filename = `chicpage-${timestamp}-${i + 1}-of-${totalSlides}.png`;
          const { blob } = dataUrlToBlob(dataUrl);
          validResults.push({
            filename,
            blob,
          });
        }

        setExportProgress({ current: i + 1, total: totalSlides });
      }

      if (validResults.length === 0) {
        throw new Error('导出失败：没有生成可保存的 PNG 图片');
      }

      // 直接逐张下载到手机文件管理器（下载目录），不再弹系统分享面板。
      for (const result of validResults) {
        downloadBlob(result.blob, result.filename);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      setShowExportPreview(false);
    } catch (error) {
      console.error('Poster export failed:', error);
    } finally {
      setIsExportingPoster(false);
      setExportProgress(undefined);
    }
  }, [activePosterTheme.background, previewSlides.length]);

  return {
    state: {
      markdown,
      html,
      imgRadius,
      styleTheme,
      wechatTheme,
      posterTheme,
      posterFont,
      posterRatio,
      posterShowHeader,
      posterShowFooter,
      showWordCount,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      activeTheme,
      activePosterTheme,
      posterLayout,
      posterThemeCSS,
      copyStatus,
      exportStatus,
      isUploading,
      uploadNotice,
      selection,
      isExportingPoster,
      exportProgress,
      showExportPreview,
      previewSlides,
      isLinkDialogOpen: insertLink.isLinkDialogOpen,
      linkUrl: insertLink.linkUrl,
      linkText: insertLink.linkText,
    },
    refs: {
      editorRef,
      previewRef,
      posterSlideRef,
      exportPreviewRef,
    },
    actions: {
      setMarkdown,
      setStyleTheme,
      setWechatTheme,
      setPosterTheme,
      setPosterFont,
      setPosterRatio,
      setShowWordCount,
      setShowExportPreview,
      setLinkUrl: insertLink.setLinkUrl,
      setLinkText: insertLink.setLinkText,
      pushHistory,
      ...commands,
      handleOpenInsertLink: insertLink.handleOpenInsertLink,
      handleCloseInsertLink: insertLink.handleCloseInsertLink,
      handleConfirmInsertLink: insertLink.handleConfirmInsertLink,
      handleSelectionChange,
      handleCopy,
      handleExportHtml,
      handleExportMarkdown,
      handleOpenPosterExportPreview,
      handleConfirmPosterExport,
    },
  };
}
