"use client";

import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useMemo,
  useImperativeHandle,
} from "react";
import { XHSTheme } from "@/lib/xhs-themes";
import { XHS_FONTS } from "@/lib/fonts";
import type { SlideItem } from "@/types";
import type { PosterRatio } from "@/types";

// 判断颜色是否为深色
function isColorDark(color: string): boolean {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

function StatusBar({ backgroundColor }: { backgroundColor: string }) {
  const isDark = isColorDark(backgroundColor);
  const color = isDark ? "#fff" : "#000";

  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex h-10 w-full items-end justify-between px-6 pb-1"
      style={{ fontSize: 12, fontWeight: 700, color }}
    >
      <span>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.8" fill={color} />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill={color} />
          <rect x="9" y="3" width="3" height="9" rx="0.8" fill={color} />
          <rect
            x="13.5"
            y="0"
            width="3"
            height="12"
            rx="0.8"
            fill={color}
            opacity="0.3"
          />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M8 9.5a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 9.5z"
            fill={color}
          />
          <path
            d="M4.2 7.1a5.4 5.4 0 0 1 7.6 0"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M1.5 4.4a9 9 0 0 1 13 0"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </svg>
        {/* Battery */}
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div
            style={{
              width: 22,
              height: 11,
              borderRadius: 3,
              border: `1.5px solid ${color}`,
              padding: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "80%",
                height: "100%",
                borderRadius: 1.5,
                background: color,
              }}
            />
          </div>
          <div
            style={{
              width: 2,
              height: 5,
              borderRadius: 1,
              background: color,
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export interface XHSSlidePreviewMethods {
  getSlidesCount: () => number;
  getSlides: () => SlideItem[];
  goToSlide: (index: number) => void;
  getCurrentSlide: () => number;
  goPrev: () => void;
  goNext: () => void;
  clearSelectedImage: () => void;
}

interface XHSSlidePreviewProps {
  html: string;
  theme: XHSTheme;
  authorName?: string;
  authorAvatar?: string;
  tags?: string[];
  showHeader?: boolean;
  showFooter?: boolean;
  hideMockUI?: boolean;
  font?: string;
  ratio?: PosterRatio;
  onImageWidthChange?: (imageIndex: number, widthPercent: number) => void;
}

export interface PosterLayoutConfig {
  ratio: PosterRatio;
  width: number;
  height: number;
  statusHeight: number;
  headerHeight: number;
  footerHeight: number;
  paddingX: number;
  paddingY: number;
  safeMargin: number;
  contentWidth: number;
  contentHeight: number;
}

const POSTER_RATIO_HEIGHT_MAP: Record<PosterRatio, number> = {
  "3:4": 480,
  "9:16": 640,
  "1:1": 360,
};

export function getPosterLayoutConfig(
  ratio: PosterRatio = "9:16",
  showFooter = true,
): PosterLayoutConfig {
  const width = 360;
  const height = POSTER_RATIO_HEIGHT_MAP[ratio];
  const statusHeight = 0;
  const headerHeight = 0;
  const footerHeight = showFooter ? 18 : 0;
  const paddingX = 18;
  const paddingY = 12;
  const safeMargin = 34;

  return {
    ratio,
    width,
    height,
    statusHeight,
    headerHeight,
    footerHeight,
    paddingX,
    paddingY,
    safeMargin,
    contentWidth: width - paddingX * 2,
    contentHeight:
      height -
      statusHeight -
      headerHeight -
      footerHeight -
      paddingY * 2 -
      safeMargin,
  };
}

export const XHS_CARD_W = getPosterLayoutConfig("3:4").width;
export const XHS_CARD_H = getPosterLayoutConfig("3:4").height;
export const XHS_STATUS_H = getPosterLayoutConfig("3:4").statusHeight;
export const XHS_FOOTER_H = getPosterLayoutConfig("3:4").footerHeight;
export const XHS_CONTENT_H = getPosterLayoutConfig("3:4").contentHeight;

// 导出内容区域的通用 CSS，供导出时注入
export function getXHSContentCSS(
  themeCSS: string,
  fontValue?: string,
  layout: PosterLayoutConfig = getPosterLayoutConfig("9:16"),
): string {
  // 将主题中的 #chicpage 替换为 #xhs-content 以适配小红书预览
  const adjustedCSS = themeCSS.replace(/#chicpage/g, "#xhs-content");
  const fontFamilyRule = fontValue
    ? `font-family: ${fontValue} !important;`
    : "";
  return `
    ${adjustedCSS}
    #xhs-content {
      ${fontFamilyRule}
      font-size: 12.5px;
      line-height: 1.7;
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      padding: 0 !important;
      margin: 0 !important;
      min-height: auto !important;
      height: auto !important;
      display: block !important;
      overflow: visible !important;
      color: inherit;
    }
    #xhs-content #chicpage {
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
    }
    #xhs-content #chicpage > *:first-child {
      margin-top: 0 !important;
      margin-bottom: 0.12em !important;
    }
    #xhs-content #chicpage > *:last-child {
      margin-bottom: 0 !important;
    }
    #xhs-content #chicpage h1,
    #xhs-content #chicpage h2,
    #xhs-content #chicpage h3 {
      margin-top: 0.25em !important;
      margin-bottom: 0.28em !important;
      line-height: 1.3 !important;
      text-align: inherit !important;
    }
    #xhs-content #chicpage > *:first-child:is(h1, h2, h3) {
      margin-top: 0 !important;
      margin-bottom: 0.18em !important;
    }
    /* Special handling for Magazine/Elegant theme borders and decorations */
    #xhs-content #chicpage h1::before, 
    #xhs-content #chicpage h1::after,
    #xhs-content #chicpage h2::before,
    #xhs-content #chicpage h2::after {
      /* Keep them if they are part of the theme, but handle scale */
    }
    /* Disable drop caps in slides as they break when paragraphs are split */
    #xhs-content #chicpage p::first-letter {
      float: none !important;
      font-size: inherit !important;
      line-height: inherit !important;
      margin: 0 !important;
      font-weight: inherit !important;
      color: inherit !important;
    }
    #xhs-content #chicpage blockquote {
      margin: 0.85em 0 !important;
      padding: 0.75em 1em !important;
      max-width: 100% !important;
      overflow: visible !important;
      box-sizing: border-box !important;
    }
    #xhs-content #chicpage blockquote p {
      margin: 0.25em 0 !important;
      line-height: 1.65 !important;
    }
    #xhs-content #chicpage hr {
      margin: 1em 0 !important;
      max-width: 100% !important;
    }
    #xhs-content #chicpage ul,
    #xhs-content #chicpage ol {
      margin: 0.7em 0 !important;
      padding-left: 1.45em !important;
      list-style-position: outside !important;
    }
    #xhs-content #chicpage ul {
      list-style-type: disc !important;
    }
    #xhs-content #chicpage ol {
      list-style-type: decimal !important;
    }
    #xhs-content #chicpage li {
      display: list-item !important;
      margin: 0.3em 0 !important;
      padding-left: 0.15em !important;
      line-height: 1.7 !important;
      list-style: inherit !important;
    }
    #xhs-content #chicpage li::marker {
      color: currentColor !important;
      font-weight: 700 !important;
    }
    #xhs-content #chicpage input[type="checkbox"] {
      width: 0.9em !important;
      height: 0.9em !important;
      margin: 0 0.35em 0 0 !important;
      vertical-align: -0.1em !important;
    }
    #xhs-content #chicpage pre {
      margin: 0.75em 0 !important;
      padding: 0.85em !important;
      max-width: 100% !important;
      max-height: ${Math.floor(layout.contentHeight * 0.48)}px !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
    }
    #xhs-content #chicpage pre code {
      display: block !important;
      padding: 0 !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-wrap: anywhere !important;
      font-size: 0.86em !important;
      line-height: 1.55 !important;
    }
    #xhs-content #chicpage code {
      white-space: normal !important;
      overflow-wrap: anywhere !important;
    }
    #xhs-content #chicpage table {
      display: table !important;
      width: 100% !important;
      max-width: 100% !important;
      table-layout: fixed !important;
      margin: 0.75em 0 !important;
      border-collapse: collapse !important;
      font-size: 0.78em !important;
      line-height: 1.35 !important;
      word-break: break-word !important;
    }
    #xhs-content #chicpage th,
    #xhs-content #chicpage td {
      padding: 0.45em 0.5em !important;
      max-width: 0 !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
    }
    #xhs-content img {
      max-width: 100% !important;
      height: auto !important;
      display: block;
      margin: 0.8em auto !important;
      border-radius: 8px;
      max-height: ${Math.floor(layout.contentHeight * 0.62)}px !important;
      object-fit: contain !important;
    }
    #xhs-content h1, 
    #xhs-content h2, 
    #xhs-content h3, 
    #xhs-content blockquote, 
    #xhs-content pre, 
    #xhs-content img,
    #xhs-content ul,
    #xhs-content ol,
    #xhs-content table {
      break-inside: avoid;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    #xhs-content p,
    #xhs-content li {
      break-inside: auto;
    }
  `;
}

/**
 * ==========================================================
 * 🚀 CHICPAGE "SEMANTIC BLOCK" PAGING ENGINE
 * 核心逻辑：
 * 1. 手动分页：支持 <!--pagebreak--> 强制换页（<hr data-pagebreak="true">）。
 * 2. 自动分页：将每个章节按语义块（h/p/ul/img/pre...）逐块装箱到页面高度预算。
 * 3. 超高块处理：文本块尝试自动切分，避免出现“单块挤爆单页”。
 * ==========================================================
 */

/**
 * 分页计算函数：按语义块测量高度并分页
 */
async function calculateSlides(
  html: string,
  themeCSS: string,
  fontValue?: string,
  layout: PosterLayoutConfig = getPosterLayoutConfig("9:16"),
): Promise<SlideItem[]> {
  // 1. 按 <hr data-pagebreak="true"> 拆分章节
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const contentH = layout.contentHeight;
  const imageMaxHeight = Math.floor(contentH * 0.62);

  doc.querySelectorAll("img").forEach((img) => {
    const width = (img as HTMLElement).style.width;
    if (!width.endsWith("%")) return;

    const widthPercent = Number.parseInt(width, 10);
    if (!Number.isFinite(widthPercent)) return;

    (img as HTMLElement).style.setProperty(
      "max-height",
      `${Math.round(imageMaxHeight * Math.min(100, Math.max(40, widthPercent)) / 100)}px`,
      "important",
    );
  });

  const expandImageParagraph = (node: Node): Node[] => {
    if (
      node.nodeType !== Node.ELEMENT_NODE ||
      (node as Element).tagName.toLowerCase() !== "p" ||
      !(node as Element).querySelector("img")
    ) {
      return [node];
    }

    const paragraph = node as HTMLElement;
    const expanded: Node[] = [];
    let textParagraph = paragraph.cloneNode(false) as HTMLElement;

    const flushTextParagraph = () => {
      if (!textParagraph.textContent?.trim() && textParagraph.children.length === 0) {
        textParagraph = paragraph.cloneNode(false) as HTMLElement;
        return;
      }
      expanded.push(textParagraph);
      textParagraph = paragraph.cloneNode(false) as HTMLElement;
    };

    Array.from(paragraph.childNodes).forEach((child) => {
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        (child as Element).tagName.toLowerCase() === "img"
      ) {
        flushTextParagraph();
        expanded.push(child.cloneNode(true));
        return;
      }

      textParagraph.appendChild(child.cloneNode(true));
    });

    flushTextParagraph();
    return expanded;
  };

  const sections: Node[][] = [];
  let currentSection: Node[] = [];

  Array.from(doc.body.childNodes).flatMap(expandImageParagraph).forEach((node) => {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).tagName.toLowerCase() === "hr" &&
      (node as Element).hasAttribute("data-pagebreak")
    ) {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
      return;
    }

    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) {
      return;
    }

    currentSection.push(node.cloneNode(true));
  });

  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  if (sections.length === 0) return [];

  // 2. 用隐藏探针测量“当前页 + 新块”是否溢出
  const styleEl = document.createElement("style");
  styleEl.textContent = getXHSContentCSS(themeCSS, fontValue, layout);

  const probe = document.createElement("div");
  const contentW = layout.contentWidth;
  probe.style.cssText = `
    position: fixed; top: -9999px; left: -9999px;
    width: ${contentW}px;
    visibility: hidden; pointer-events: none;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0;
  `;
  const probeContent = document.createElement("div");
  probeContent.id = "xhs-content";
  probe.appendChild(probeContent);

  document.head.appendChild(styleEl);
  document.body.appendChild(probe);

  const finalSlides: SlideItem[] = [];
  const sourceImages = Array.from(doc.querySelectorAll("img"))
    .map((img) => img.getAttribute("src"))
    .filter((src): src is string => Boolean(src));

  const preloadImage = (src: string) =>
    new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
      if (image.complete) resolve();
      setTimeout(resolve, 2500);
    });

  await Promise.all(sourceImages.map(preloadImage));

  const nodesToHtml = (nodes: Node[]) => {
    const wrapper = document.createElement("div");
    nodes.forEach((n) => wrapper.appendChild(n.cloneNode(true)));
    return wrapper.innerHTML;
  };

  const hasImage = (node: Node) =>
    node.nodeType === Node.ELEMENT_NODE &&
    ((node as Element).tagName.toLowerCase() === "img" ||
      Boolean((node as Element).querySelector("img")));

  const getImagesInNode = (node: Node): HTMLImageElement[] => {
    if (node.nodeType !== Node.ELEMENT_NODE) return [];
    const element = node as Element;
    const images = Array.from(element.querySelectorAll("img"));
    if (element.tagName.toLowerCase() === "img") {
      return [element as HTMLImageElement, ...images];
    }
    return images;
  };

  const waitImagesInElement = (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll("img"));
    if (images.length === 0) return Promise.resolve();
    return Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 2000);
          }),
      ),
    ).then(() => undefined);
  };

  const measureHeight = async (nodes: Node[], waitForImage = false) => {
    probeContent.innerHTML = "";
    // Wrap in #xhs-content AND #chicpage so XHS-specific theme overrides apply during measurement
    const themeWrap = document.createElement("div");
    themeWrap.id = "chicpage";
    nodes.forEach((n) => themeWrap.appendChild(n.cloneNode(true)));

    const xhsWrap = document.createElement("div");
    xhsWrap.id = "xhs-content";
    xhsWrap.appendChild(themeWrap);

    const outerWrap = document.createElement("div");
    outerWrap.style.cssText = "display: block; width: 100%; border: 1px solid transparent; padding: 0;";
    outerWrap.appendChild(xhsWrap);
    
    probeContent.appendChild(outerWrap);
    
    if (waitForImage) {
      await waitImagesInElement(probeContent);
    }
    // Use getBoundingClientRect to get precise sub-pixel height
    const h = outerWrap.getBoundingClientRect().height;
    // Remove the 2px border height
    return h - 2;
  };

  const findNaturalBreakIndex = (text: string, preferred: number) => {
    const min = Math.max(0, Math.floor(preferred * 0.55));
    const range = text.slice(min, preferred);
    const matches = Array.from(range.matchAll(/[。！？.!?；;，,\n]/g));
    if (matches.length === 0) return preferred;
    const last = matches[matches.length - 1];
    return min + (last.index ?? 0) + 1;
  };

  const tryFitImageBlock = async (
    currentBlocks: Node[],
    block: Node,
    targetH: number,
  ): Promise<Node | null> => {
    if (!hasImage(block) || targetH < 96) return null;

    let low = 72;
    let high = Math.max(72, Math.floor(targetH));
    let best: Node | null = null;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidateBlock = block.cloneNode(true);

      getImagesInNode(candidateBlock).forEach((img) => {
        img.style.setProperty("max-height", `${mid}px`, "important");
        img.style.setProperty("object-fit", "contain", "important");
      });

      const h = await measureHeight([...currentBlocks, candidateBlock], true);
      if (h <= contentH) {
        best = candidateBlock;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return best;
  };

  /**
   * Slice a block node into two parts: 
   * - one that fits within targetH
   * - the rest
   */
  const sliceBlock = async (block: Node, targetH: number): Promise<{ first: Node; rest: Node[] } | null> => {
    if (block.nodeType !== Node.ELEMENT_NODE) return null;
    const element = block as Element;
    const tag = element.tagName.toLowerCase();
    
    // Support splitting common block types
    const textSplitable = ["p", "li", "blockquote"].includes(tag);
    const listSplitable = ["ul", "ol"].includes(tag);
    if (!textSplitable && !listSplitable) return null;

    if (listSplitable) {
      const items = Array.from(element.children);
      if (items.length <= 1) return null;
      let low = 0; // Can we put 0 items? (Handled below)
      let high = items.length;
      let best = 0;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (mid === 0) { low = 1; continue; }
        const candidate = element.cloneNode(false) as HTMLElement;
        for (let i = 0; i < mid; i++) candidate.appendChild(items[i].cloneNode(true));
        const h = await measureHeight([candidate], false);
        if (h <= targetH) { best = mid; low = mid + 1; } else { high = mid - 1; }
      }
      if (best === 0) return null;
      const first = element.cloneNode(false) as HTMLElement;
      items.slice(0, best).forEach(i => first.appendChild(i.cloneNode(true)));
      const rest = element.cloneNode(false) as HTMLElement;
      items.slice(best).forEach(i => rest.appendChild(i.cloneNode(true)));
      return { first, rest: [rest] };
    }

    // Text splitting. Preserve inline markup while splitting by text offset.
    const sourceText = element.textContent || "";
    if (sourceText.trim().length < 10) return null;

    const hasContent = (node: Node | null): node is Node =>
      Boolean(node && (node.textContent || "").trim());

    const splitNodeAtTextOffset = (
      node: Node,
      offset: number,
    ): { first: Node | null; rest: Node | null } => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const firstText = text.slice(0, offset);
        const restText = text.slice(offset);
        return {
          first: firstText ? document.createTextNode(firstText) : null,
          rest: restText ? document.createTextNode(restText) : null,
        };
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return offset > 0
          ? { first: node.cloneNode(true), rest: null }
          : { first: null, rest: node.cloneNode(true) };
      }

      const first = node.cloneNode(false) as HTMLElement;
      const rest = node.cloneNode(false) as HTMLElement;
      let remaining = offset;

      Array.from(node.childNodes).forEach((child) => {
        const childTextLength = (child.textContent || "").length;

        if (remaining <= 0) {
          rest.appendChild(child.cloneNode(true));
          return;
        }

        if (childTextLength <= remaining) {
          first.appendChild(child.cloneNode(true));
          remaining -= childTextLength;
          return;
        }

        const split = splitNodeAtTextOffset(child, remaining);
        if (split.first) first.appendChild(split.first);
        if (split.rest) rest.appendChild(split.rest);
        remaining = 0;
      });

      return {
        first: hasContent(first) ? first : null,
        rest: hasContent(rest) ? rest : null,
      };
    };

    const createNodeAtOffset = (offset: number): Node | null =>
      splitNodeAtTextOffset(element, offset).first;

    let low = 1;
    let high = sourceText.length;
    let best = 0;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const cand = createNodeAtOffset(mid);
      if (!cand) {
        low = mid + 1;
        continue;
      }
      const h = await measureHeight([cand], false);
      if (h <= targetH) { best = mid; low = mid + 1; } else { high = mid - 1; }
    }
    if (best < 5) return null;
    const splitAt = findNaturalBreakIndex(sourceText, best);
    const split = splitNodeAtTextOffset(element, splitAt);
    if (!hasContent(split.first) || !hasContent(split.rest)) return null;
    return { first: split.first, rest: [split.rest] };
  };

  try {
    for (let sectionId = 0; sectionId < sections.length; sectionId++) {
      const blockQueue = [...sections[sectionId]];
      const pagesInSection: string[] = [];
      let currentPageBlocks: Node[] = [];

      while (blockQueue.length > 0) {
        const block = blockQueue.shift()!;
        
        // Measure current cumulative height of this page
        const beforeH = currentPageBlocks.length > 0 
          ? await measureHeight(currentPageBlocks, false) 
          : 0;

        const candidate = [...currentPageBlocks, block];
        const candH = await measureHeight(candidate, hasImage(block));

        if (candH <= contentH) {
          currentPageBlocks = candidate;
          continue;
        }

        // Doesn't fit. Can we slice the current block to fill the gap?
        const remainingH = contentH - beforeH;
        if (remainingH > 80) { // Gap worth filling
          const sliced = await sliceBlock(block, remainingH);
          if (sliced) {
            currentPageBlocks.push(sliced.first);
            pagesInSection.push(nodesToHtml(currentPageBlocks));
            currentPageBlocks = [];
            blockQueue.unshift(...sliced.rest);
            continue;
          }

          const fittedImage = await tryFitImageBlock(
            currentPageBlocks,
            block,
            remainingH,
          );
          if (fittedImage) {
            currentPageBlocks.push(fittedImage);
            pagesInSection.push(nodesToHtml(currentPageBlocks));
            currentPageBlocks = [];
            continue;
          }
        }

        // Must transition to new page
        if (currentPageBlocks.length > 0) {
          pagesInSection.push(nodesToHtml(currentPageBlocks));
          currentPageBlocks = [];
        }

        // Is this block alone too big for a whole page?
        const soloH = await measureHeight([block], hasImage(block));
        if (soloH <= contentH) {
          currentPageBlocks = [block];
        } else {
          const fittedImage = await tryFitImageBlock([], block, contentH);
          if (fittedImage) {
            currentPageBlocks = [fittedImage];
            continue;
          }

          // Slice for the next full page
          const sliced = await sliceBlock(block, contentH);
          if (sliced) {
            currentPageBlocks = [sliced.first];
            blockQueue.unshift(...sliced.rest);
          } else {
            // Unsliceable (images etc.)
            pagesInSection.push(nodesToHtml([block]));
          }
        }
      }

      if (currentPageBlocks.length > 0) {
        pagesInSection.push(nodesToHtml(currentPageBlocks));
      }

      const totalInGroup = pagesInSection.length || 1;
      pagesInSection.forEach((pageHtml, pageInGroup) => {
        finalSlides.push({
          html: pageHtml,
          sectionId,
          pageInGroup,
          totalInGroup,
        });
      });
    }
  } finally {
    document.body.removeChild(probe);
    document.head.removeChild(styleEl);
  }

  return finalSlides;
}

// 保留旧名称，供外部逻辑兼容调用
export const splitIntoSlides = calculateSlides;


export const XHSSlidePreview = forwardRef<
  XHSSlidePreviewMethods,
  XHSSlidePreviewProps
>(
  (
    {
      html,
      theme,
      showFooter = true,
      hideMockUI = false,
      font = "system",
      ratio = "9:16",
      onImageWidthChange,
    },
    ref,
  ) => {
    const layout = useMemo(
      () => getPosterLayoutConfig(ratio, showFooter),
      [ratio, showFooter],
    );
    const [slides, setSlides] = useState<SlideItem[]>([]);
    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [selectedImage, setSelectedImage] = useState<{
      slideIndex: number;
      imageIndex: number;
      src: string;
      widthPercent: number;
      top: number;
      left: number;
    } | null>(null);

    useEffect(() => {
      if (!html) return;

      const currentFontValue =
        XHS_FONTS.find((f) => f.id === font)?.value || XHS_FONTS[0].value;

      let isMounted = true;
      const run = async () => {
        const result = await splitIntoSlides(
          html,
          theme.css,
          currentFontValue,
          layout,
        );
        if (isMounted) {
          setSlides(result);
          setCurrent((prev) => Math.min(prev, Math.max(result.length - 1, 0)));
        }
      };
      run();

      return () => {
        isMounted = false;
      };
    }, [html, theme.css, font, layout]);

    const go = (dir: 1 | -1) => {
      setCurrent((p) =>
        Math.max(0, Math.min(displaySlides.length - 1, p + dir)),
      );
    };

    const isImageControlEvent = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      Boolean(target.closest("[data-xhs-image-control]"));

    const onMouseDown = (e: React.MouseEvent) => {
      if (isImageControlEvent(e.target)) return;
      setIsDragging(true);
      setStartX(e.clientX);
      setDragOffset(0);
    };
    const onMouseMove = (e: React.MouseEvent) => {
      if (isImageControlEvent(e.target)) return;
      if (isDragging) setDragOffset(e.clientX - startX);
    };
    const onMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (dragOffset > 50) go(-1);
      else if (dragOffset < -50) go(1);
      setDragOffset(0);
    };
    const onTouchStart = (e: React.TouchEvent) => {
      if (isImageControlEvent(e.target)) return;
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setDragOffset(0);
    };
    const onTouchMove = (e: React.TouchEvent) => {
      if (isImageControlEvent(e.target)) return;
      if (isDragging) setDragOffset(e.touches[0].clientX - startX);
    };
    const onTouchEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (dragOffset > 50) go(-1);
      else if (dragOffset < -50) go(1);
      setDragOffset(0);
    };

    // 安全回退：如果尚未完成分页计算，至少展示原始 HTML 为一页
    const displaySlides = !html
      ? [{ html: "", sectionId: 0, pageInGroup: 0, totalInGroup: 1 }]
      : slides.length > 0
      ? slides
      : [{ html, sectionId: 0, pageInGroup: 0, totalInGroup: 1 }];

    const slideCount = displaySlides.length;
    const currentSlide = Math.min(current, Math.max(slideCount - 1, 0));

    // 计算位移，并在边缘滑动时增加阻尼感
    const translateX = (() => {
      const base = -currentSlide * layout.width;
      if (currentSlide === 0 && dragOffset > 0) return base + dragOffset * 0.35;
      if (currentSlide === slideCount - 1 && dragOffset < 0)
        return base + dragOffset * 0.35;
      return base + dragOffset;
    })();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!selectedImage) return;

      const handlePointerDown = (event: PointerEvent) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (!containerRef.current?.contains(target)) return;
        if (target.closest("[data-xhs-image-control]")) return;
        if (target.closest("img[data-image-index]")) return;
        setSelectedImage(null);
      };

      document.addEventListener("pointerdown", handlePointerDown, true);
      return () => {
        document.removeEventListener("pointerdown", handlePointerDown, true);
      };
    }, [selectedImage]);

    const getImageControlPosition = (
      slideIndex: number,
      imageIndex: number,
    ) => {
      const container = containerRef.current;
      const image = container?.querySelector<HTMLImageElement>(
        `img[data-slide-index="${slideIndex}"][data-image-index="${imageIndex}"]`,
      );
      if (!container || !image) return { top: 0, left: layout.width / 2 };

      const imageRect = image.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const controlWidth = 244;
      const controlHeight = 76;
      const left = Math.min(
        Math.max(imageRect.left - containerRect.left + imageRect.width / 2, controlWidth / 2 + 8),
        layout.width - controlWidth / 2 - 8,
      );
      const preferredTop = imageRect.bottom - containerRect.top + 10;
      const fallbackTop = imageRect.top - containerRect.top - controlHeight - 10;
      const top =
        preferredTop + controlHeight <= layout.height - 8
          ? preferredTop
          : Math.max(8, fallbackTop);

      return { top, left };
    };

    useImperativeHandle(ref, () => ({
      getSlidesCount: () => slideCount,
      getSlides: () => displaySlides,
      goToSlide: (index: number) =>
        setCurrent(Math.max(0, Math.min(slideCount - 1, index))),
      getCurrentSlide: () => currentSlide,
      goPrev: () => setCurrent((prev) => Math.max(0, prev - 1)),
      goNext: () =>
        setCurrent((prev) => Math.min(slideCount - 1, prev + 1)),
      clearSelectedImage: () => setSelectedImage(null),
    }));

    return (
      <div
        ref={containerRef}
        className="xhs-slide-container select-none"
        style={{
          backgroundColor: theme.background,
          backgroundImage: theme.backgroundImage,
          backgroundRepeat: theme.backgroundRepeat,
          backgroundSize: theme.backgroundSize,
          backgroundPosition: theme.backgroundPosition,
          width: `${layout.width}px`,
          height: `${layout.height}px`,
          position: "relative",
          overflow: "hidden",
          borderRadius: "0",
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.closest("img") && !target.closest("[data-xhs-image-control]")) {
            setSelectedImage(null);
          }
        }}
      >
        {/* Notch */}
        {!hideMockUI && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              height: "24px",
              borderRadius: "0 0 20px 20px",
              background: "#000",
              zIndex: 30,
            }}
          />
        )}

        {/* Status Bar */}
        <div
          style={{
            height: `${layout.statusHeight}px`,
            flexShrink: 0,
            position: "relative",
            zIndex: 20,
          }}
        >
          {!hideMockUI && <StatusBar backgroundColor={theme.background} />}
        </div>
        <style>{`
          ${getXHSContentCSS(theme.css, XHS_FONTS.find((f) => f.id === font)?.value || XHS_FONTS[0].value, layout)}
          .xhs-preview-image-selectable {
            cursor: pointer;
            transition: box-shadow 0.2s ease, outline-color 0.2s ease;
          }
          .xhs-preview-image-selectable:hover {
            box-shadow: 0 0 0 2px rgba(24, 24, 27, 0.16);
          }
          .xhs-preview-image-selectable.is-selected {
            outline: 2px solid rgba(24, 24, 27, 0.95);
            outline-offset: 2px;
            box-shadow: 0 10px 24px rgba(24, 24, 27, 0.18);
          }
          .xhs-slide-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 28px; height: 28px;
            border-radius: 50%;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 20;
            opacity: 0; transition: all 0.2s;
          }
          .xhs-slide-container:hover .xhs-slide-nav { opacity: 1; }
          .xhs-slide-nav:hover { background: rgba(0,0,0,0.5); }
          .xhs-slide-nav.left { left: -20px; }
          .xhs-slide-nav.right { right: -20px; }
          .xhs-slide-nav svg { width: 14px; height: 14px; color: #fff; }
        `}</style>

        {/* Slides viewport */}
        <div
          style={{ flex: 1, overflow: "hidden", position: "relative" }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (!target.closest("img")) {
              setSelectedImage(null);
            }
          }}
        >
          <div
            style={{
              display: "flex",
              width: `${displaySlides.length * layout.width}px`,
              height: "100%",
              transform: `translateX(${translateX}px)`,
              transition: isDragging
                ? "none"
                : "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
            }}
          >
            {displaySlides.map((slide, i) => (
              <div
                key={`${slide.sectionId}-${slide.pageInGroup}-${i}`}
                className="xhs-slide-page"
                style={{
                  backgroundColor: theme.background,
                  backgroundImage: theme.backgroundImage,
                  backgroundRepeat: theme.backgroundRepeat,
                  backgroundSize: theme.backgroundSize,
                  backgroundPosition: theme.backgroundPosition,
                  width: `${layout.width}px`,
                  flexShrink: 0,
                  height: "100%",
                  padding: `${layout.paddingY}px ${layout.paddingX}px`,
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                <div
                  className="xhs-slide-content-viewport"
                  style={{
                    flex: 1,
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    id="xhs-content"
                    className="xhs-content-wrapper"
                    style={{
                      width: `${layout.contentWidth}px`,
                      maxWidth: `${layout.contentWidth}px`,
                      height: `${layout.contentHeight}px`,
                      overflow: "hidden",
                      display: "block",
                    }}
                  >
                    <div
                      id="chicpage"
                      dangerouslySetInnerHTML={{ __html: slide.html }}
                      ref={(node) => {
                        if (!node) return;
                        const images = Array.from(node.querySelectorAll("img"));
                        images.forEach((img, imageIndex) => {
                          const markdownImageIndex = Number(
                            img.dataset.chicpageImageIndex ?? imageIndex,
                          );
                          const isSelected =
                            selectedImage?.slideIndex === i &&
                            selectedImage?.imageIndex === markdownImageIndex;
                          img.classList.add("xhs-preview-image-selectable");
                          img.classList.toggle("is-selected", isSelected);
                          img.dataset.imageIndex = String(markdownImageIndex);
                          img.dataset.slideIndex = String(i);
                          img.style.pointerEvents = "auto";
                          const imageWidth = img.style.width;
                          if (imageWidth.endsWith("%")) {
                            const widthPercent = Number.parseInt(imageWidth, 10);
                            if (Number.isFinite(widthPercent)) {
                              img.style.setProperty(
                                "max-height",
                                `${Math.round(Math.floor(layout.contentHeight * 0.62) * Math.min(100, Math.max(40, widthPercent)) / 100)}px`,
                                "important",
                              );
                            }
                          }
                          img.onmousedown = (event) => event.stopPropagation();
                          img.ontouchstart = (event) => event.stopPropagation();
                          img.onclick = (event) => {
                            event.stopPropagation();
                            const width = img.style.width;
                            const widthPercent = width.endsWith("%")
                              ? Number.parseInt(width, 10)
                              : 100;
                            setSelectedImage({
                              slideIndex: i,
                              imageIndex: markdownImageIndex,
                              src: img.currentSrc || img.getAttribute("src") || "",
                              widthPercent: Number.isFinite(widthPercent)
                                ? widthPercent
                                : 100,
                              ...getImageControlPosition(i, markdownImageIndex),
                            });
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: showFooter ? `${layout.footerHeight + 4}px` : "8px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 5,
            zIndex: 10,
          }}
        >
          {Array.from({ length: slideCount }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentSlide ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === currentSlide ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Footer */}
        {showFooter && (
          <div style={{ height: `${layout.footerHeight}px`, flexShrink: 0 }} />
        )}

        {selectedImage && selectedImage.slideIndex === currentSlide && (
          <div
            data-xhs-image-control="true"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: selectedImage.left,
              top: selectedImage.top,
              transform: "translateX(-50%)",
              zIndex: 25,
              width: 244,
              padding: "10px 12px",
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #09090b",
              boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#09090b",
                }}
              >
                图片宽度
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#09090b",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {selectedImage.widthPercent}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              value={selectedImage.widthPercent}
              onChange={(e) => {
                const widthPercent = Number(e.target.value);
                const image = containerRef.current?.querySelector<HTMLImageElement>(
                  `img[data-slide-index="${selectedImage.slideIndex}"][data-image-index="${selectedImage.imageIndex}"]`,
                );
                if (image) {
                  image.style.width = `${widthPercent}%`;
                  image.style.maxWidth = "100%";
                  image.style.height = "auto";
                  image.style.setProperty(
                    "max-height",
                    `${Math.round(Math.floor(layout.contentHeight * 0.62) * widthPercent / 100)}px`,
                    "important",
                  );
                }
                setSelectedImage((prev) =>
                  prev
                    ? {
                        ...prev,
                        widthPercent,
                        ...getImageControlPosition(prev.slideIndex, prev.imageIndex),
                      }
                    : prev,
                );
                onImageWidthChange?.(selectedImage.imageIndex, widthPercent);
              }}
              style={{
                width: "100%",
                accentColor: "#09090b",
              }}
            />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 12,
            fontSize: 10,
            color: "rgba(0,0,0,0.2)",
          }}
        >
          ChicPage
        </div>
      </div>
    );
  },
);

XHSSlidePreview.displayName = "XHSSlidePreview";
