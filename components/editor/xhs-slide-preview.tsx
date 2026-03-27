"use client";

import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { XHSTheme } from "@/lib/xhs-themes";
import { XHS_FONTS } from "@/lib/fonts";

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
}

export const XHS_CARD_W = 334;
export const XHS_CARD_H = 672;
export const XHS_STATUS_H = 40; // 状态栏高度
const HEADER_H = 0;
export const XHS_FOOTER_H = 48;
const PADDING_X = 26; // 增加左右内边距，从 20px 提升至 26px
const PADDING_Y = 32; // 增加上下内边距，从 24px 提升至 32px
export const SAFE_MARGIN = 20; // 极大幅度降低安全边距，优先保证内容不被拆分（原 102 -> 64 -> 20）

export const XHS_CONTENT_H =
  XHS_CARD_H -
  XHS_STATUS_H -
  HEADER_H -
  XHS_FOOTER_H -
  PADDING_Y * 2 -
  SAFE_MARGIN; // 450px 左右

// 导出内容区域的通用 CSS，供导出时注入
export function getXHSContentCSS(themeCSS: string, fontValue?: string): string {
  // 将主题中的 #chicpage 替换为 #xhs-content 以适配小红书预览
  const adjustedCSS = themeCSS.replace(/#chicpage/g, "#xhs-content");
  const fontFamilyRule = fontValue
    ? `font-family: ${fontValue} !important;`
    : "";
  return `
    ${adjustedCSS}
    #xhs-content {
      ${fontFamilyRule}
      font-size: 14.5px;
      line-height: 1.8;
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
    #xhs-content > * {
      margin-bottom: 0.8em;
    }
    #xhs-content > *:last-child {
      margin-bottom: 0;
    }
    #xhs-content h1 {
      margin-top: 0.6em !important;
      padding-top: 0.4em !important;
      padding-bottom: 0.4em !important;
    }
    #xhs-content h1,
    #xhs-content h2,
    #xhs-content h3 {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      line-height: 1.4;
    }
    #xhs-content img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 0.8em 0;
      border-radius: 8px;
      max-height: ${Math.floor(XHS_CONTENT_H * 0.78)}px;
      object-fit: contain;
    }
    #xhs-content pre {
      overflow-x: auto;
      padding: 12px;
      border-radius: 6px;
      margin: 0.8em 0;
      font-size: 13px;
      max-height: ${Math.floor(XHS_CONTENT_H * 0.7)}px;
    }
    #xhs-content blockquote {
      margin: 0.8em 0;
      padding: 10px 14px;
      border-left: 3px solid currentColor;
      opacity: 0.8;
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
 * 1. 手动分页：支持 Markdown 中的 --- 强制换页（<hr>）。
 * 2. 自动分页：将每个章节按语义块（h/p/ul/img/pre...）逐块装箱到页面高度预算。
 * 3. 超高块处理：单块超高时单独成页（并依赖样式约束避免图片/代码无限撑高）。
 * ==========================================================
 */

interface SlideItem {
  html: string;      // 归属章节的 HTML
  sectionId: number; // 章节索引
  pageInGroup: number; // 在该章节中的页码
  totalInGroup: number; // 该章节总页数
}

/**
 * 分页计算函数：按语义块测量高度并分页
 */
async function calculateSlides(
  html: string,
  themeCSS: string,
  fontValue?: string,
): Promise<SlideItem[]> {
  // 1. 按 <hr>（即 ---）拆分章节，每个章节由顶层语义块组成
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const sections: Node[][] = [];
  let currentSection: Node[] = [];

  Array.from(doc.body.childNodes).forEach((node) => {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).tagName.toLowerCase() === "hr"
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
  styleEl.textContent = getXHSContentCSS(themeCSS, fontValue);

  const probe = document.createElement("div");
  const contentW = XHS_CARD_W - PADDING_X * 2;
  const contentH = XHS_CONTENT_H;
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
    nodes.forEach((n) => probeContent.appendChild(n.cloneNode(true)));
    if (waitForImage) {
      await waitImagesInElement(probeContent);
    }
    return probeContent.scrollHeight;
  };

  try {
    for (let sectionId = 0; sectionId < sections.length; sectionId++) {
      const sectionBlocks = sections[sectionId];
      const pagesInSection: string[] = [];
      let currentPageBlocks: Node[] = [];

      for (const block of sectionBlocks) {
        const candidate = [...currentPageBlocks, block];
        const candidateHeight = await measureHeight(candidate, hasImage(block));

        if (candidateHeight <= contentH) {
          currentPageBlocks = candidate;
          continue;
        }

        if (currentPageBlocks.length > 0) {
          pagesInSection.push(nodesToHtml(currentPageBlocks));
          currentPageBlocks = [];
        }

        const blockHeight = await measureHeight([block], hasImage(block));
        if (blockHeight <= contentH) {
          currentPageBlocks = [block];
        } else {
          // 超高块单独成页：避免把一个大块硬塞到上一页导致裁切
          pagesInSection.push(nodesToHtml([block]));
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

// 供外部引用的占位符，不再使用旧的 splitIntoSlides 名称以防冲突
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
    },
    ref,
  ) => {
    const [slides, setSlides] = useState<SlideItem[]>([]);
    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    useEffect(() => {
      if (!html) return;

      const currentFontValue =
        XHS_FONTS.find((f) => f.id === font)?.value || XHS_FONTS[0].value;

      let isMounted = true;
      const run = async () => {
        const result = await splitIntoSlides(html, theme.css, currentFontValue);
        if (isMounted) {
          setSlides(result);
          setCurrent(0);
        }
      };
      run();

      return () => {
        isMounted = false;
      };
    }, [html, theme.css, font]);

    const go = (dir: 1 | -1) => {
      setCurrent((p) =>
        Math.max(0, Math.min(displaySlides.length - 1, p + dir)),
      );
    };

    const onMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setStartX(e.clientX);
      setDragOffset(0);
    };
    const onMouseMove = (e: React.MouseEvent) => {
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
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setDragOffset(0);
    };
    const onTouchMove = (e: React.TouchEvent) => {
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
    const displaySlides = slides.length > 0 
      ? slides 
      : [{ html, sectionId: 0, pageInGroup: 0, totalInGroup: 1 }];

    const slideCount = displaySlides.length;

    // 计算位移，并在边缘滑动时增加阻尼感
    const translateX = (() => {
      const base = -current * XHS_CARD_W;
      if (current === 0 && dragOffset > 0) return base + dragOffset * 0.35;
      if (current === slideCount - 1 && dragOffset < 0)
        return base + dragOffset * 0.35;
      return base + dragOffset;
    })();

    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getSlidesCount: () => slideCount,
      getSlides: () => displaySlides,
      goToSlide: (index: number) =>
        setCurrent(Math.max(0, Math.min(slideCount - 1, index))),
      getCurrentSlide: () => current,
      goPrev: () => setCurrent((prev) => Math.max(0, prev - 1)),
      goNext: () =>
        setCurrent((prev) => Math.min(slideCount - 1, prev + 1)),
    }));

    return (
      <div
        ref={containerRef}
        className="xhs-slide-container select-none"
        style={{
          background: theme.background,
          width: `${XHS_CARD_W}px`,
          height: `${XHS_CARD_H}px`,
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
            height: `${XHS_STATUS_H}px`,
            flexShrink: 0,
            position: "relative",
            zIndex: 20,
          }}
        >
          {!hideMockUI && <StatusBar backgroundColor={theme.background} />}
        </div>
        <style>{`
          ${getXHSContentCSS(theme.css, XHS_FONTS.find((f) => f.id === font)?.value || XHS_FONTS[0].value)}
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
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <div
            style={{
              display: "flex",
              width: `${displaySlides.length * XHS_CARD_W}px`,
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
                  width: `${XHS_CARD_W}px`,
                  flexShrink: 0,
                  height: "100%",
                  padding: `${PADDING_Y}px ${PADDING_X}px`,
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
                    dangerouslySetInnerHTML={{ __html: slide.html }}
                    style={{
                      width: `${XHS_CARD_W - PADDING_X * 2}px`,
                      maxWidth: `${XHS_CARD_W - PADDING_X * 2}px`,
                      height: `${XHS_CONTENT_H}px`,
                      overflow: "hidden",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: showFooter ? `${XHS_FOOTER_H + 6}px` : "12px",
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
                width: i === current ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i === current ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>

        {/* Footer */}
        {showFooter && (
          <div style={{ height: `${XHS_FOOTER_H}px`, flexShrink: 0 }} />
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
