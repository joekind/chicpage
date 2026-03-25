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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word; /* 确保长单词/链接换行 */
      padding: 0 !important; /* 强制覆盖主题内边距，交给预览容器统一控制 */
      margin: 0 !important;
      min-height: auto !important; /* 必须：防止主题自带的 100% 高度撑开探测容器 */
      height: auto !important;
      display: block !important;
      overflow: visible !important;
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
    }
    #xhs-content pre {
      overflow-x: auto;
      padding: 12px;
      border-radius: 6px;
      margin: 0.8em 0;
      font-size: 13px;
    }
    #xhs-content blockquote {
      margin: 0.8em 0;
      padding: 10px 14px;
      border-left: 3px solid currentColor;
      opacity: 0.8;
    }
    #xhs-content ul, #xhs-content ol {
      padding-left: 1.4em;
    }
    #xhs-content li {
      margin-bottom: 0.4em;
    }
  `;
}

// 判断节点是否为不可分割元素
function isNonSplittable(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const tagName = (node as Element).tagName.toLowerCase();
  // 标题、代码块、引用块、表格、图片等不可分割
  return [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "pre",
    "blockquote",
    "table",
    "img",
    "figure",
  ].includes(tagName);
}

// 判断节点组是否包含紧密关联的元素（如标题+段落）
function shouldKeepTogether(nodes: Node[]): boolean {
  if (nodes.length < 2) return false;

  // 检查最后两个节点：如果是标题+内容，应该保持在一起
  const lastTwo = nodes.slice(-2);
  if (lastTwo.length === 2) {
    const first = lastTwo[0];
    const second = lastTwo[1];

    if (
      first.nodeType === Node.ELEMENT_NODE &&
      second.nodeType === Node.ELEMENT_NODE
    ) {
      const firstTag = (first as Element).tagName.toLowerCase();
      const secondTag = (second as Element).tagName.toLowerCase();

      // 标题后面跟着段落/列表，应该保持在一起
      // 标题后面跟着段落/列表，或者前置元信息跟着标题，应该保持在一起
      if (
        (["h1", "h2", "h3", "h4", "h5", "h6"].includes(firstTag) &&
          ["p", "ul", "ol", "blockquote", "img"].includes(secondTag)) ||
        (firstTag === "p" && ["h1", "h2"].includes(secondTag))
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 离屏探针，用于精确计算内容高度
 */
async function splitIntoSlides(
  html: string,
  themeCSS: string,
  fontValue?: string,
): Promise<string[]> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const initialNodes = Array.from(doc.body.childNodes).filter(
    (n) =>
      n.nodeType === Node.ELEMENT_NODE ||
      (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()),
  );
  if (initialNodes.length === 0) return [html];

  const styleEl = document.createElement("style");
  styleEl.textContent = getXHSContentCSS(themeCSS, fontValue);

  const probe = document.createElement("div");
  probe.id = "xhs-content";
  probe.style.cssText = `
    position: fixed; top: -9999px; left: -9999px;
    width: ${XHS_CARD_W - PADDING_X * 2}px; visibility: hidden; pointer-events: none;
    box-sizing: border-box; overflow: hidden;
  `;

  document.head.appendChild(styleEl);
  document.body.appendChild(probe);

  // 预加载所有图片，确保高度计算准确
  const images = Array.from(doc.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      return new Promise((resolve) => {
        const i = new Image();
        i.onload = () => resolve(null);
        i.onerror = () => resolve(null);
        i.src = (img as HTMLImageElement).src;
      });
    }),
  );

  const getH = (nodesArr: Node[]) => {
    probe.innerHTML = "";
    nodesArr.forEach((n) => probe.appendChild(n.cloneNode(true)));
    return probe.scrollHeight;
  };

  const BUFFER = 100; // 增大容差，允许封面等大块内容撑满页面
  const MAX_HEIGHT = XHS_CONTENT_H + BUFFER;

  const slides: string[] = [];
  let bucket: Node[] = [];
  const queue: Node[] = [...initialNodes];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const tempBucket = [...bucket, node];
    const tempH = getH(tempBucket);

    if (tempH > MAX_HEIGHT) {
      if (bucket.length > 0) {
        // 当前页已有内容，检查是否需要保持在一起（如标题+下一段）
        if (shouldKeepTogether(tempBucket)) {
          const lastOne = bucket.pop()!; // 将相关联的第一个元素（如标题）移出
          if (bucket.length > 0) {
            // 如果桶里还有别的内容，正常输出当前页
            const tmp = document.createElement("div");
            bucket.forEach((n) => tmp.appendChild(n.cloneNode(true)));
            slides.push(tmp.innerHTML);
            bucket = [lastOne]; // 让这个标题去下一页
          } else {
            // 如果桶里原本就只有这个标题，那躲不掉了，只能在当前页强行输出
            bucket = [lastOne];
          }
          queue.unshift(node);
        } else {
          // 正常换页
          const tmp = document.createElement("div");
          bucket.forEach((n) => tmp.appendChild(n.cloneNode(true)));
          slides.push(tmp.innerHTML);
          bucket = [];
          queue.unshift(node);
        }
      } else {
        // 当前页为空但该节点仍超重，尝试对容器（列表/div）进行拆分
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          const tagName = el.tagName.toLowerCase();

          if (tagName === "ul" || tagName === "ol" || tagName === "div") {
            const children = Array.from(el.childNodes).filter(
              (n) =>
                n.nodeType === Node.ELEMENT_NODE ||
                (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()),
            );

            if (children.length > 1) {
              // 寻找拆分点
              let splitIndex = 1;
              for (let i = 1; i <= children.length; i++) {
                const testWrapper = el.cloneNode(false) as Element;
                for (let j = 0; j < i; j++)
                  testWrapper.appendChild(children[j].cloneNode(true));
                if (getH([testWrapper]) > MAX_HEIGHT) {
                  splitIndex = Math.max(1, i - 1);
                  break;
                }
                splitIndex = i;
              }

              const firstPart = el.cloneNode(false) as Element;
              const secondPart = el.cloneNode(false) as Element;

              for (let i = 0; i < splitIndex; i++)
                firstPart.appendChild(children[i].cloneNode(true));
              for (let i = splitIndex; i < children.length; i++)
                secondPart.appendChild(children[i].cloneNode(true));

              // 有序列表特殊处理：保持序列连续性
              if (tagName === "ol") {
                const startAttr = el.getAttribute("start");
                const start = startAttr ? parseInt(startAttr) : 1;
                secondPart.setAttribute(
                  "start",
                  (start + splitIndex).toString(),
                );
              }

              queue.unshift(secondPart);
              queue.unshift(firstPart);
              continue; // 重新处理拆分后的第一部分
            }
          }
        }
        // 如果不可拆分或只有一个子节点也放不下，则强制放入（会产生溢出，但已是最小颗粒）
        bucket.push(node);
      }
    } else {
      bucket.push(node);
    }
  }

  if (bucket.length > 0) {
    const tmp = document.createElement("div");
    bucket.forEach((n) => tmp.appendChild(n.cloneNode(true)));
    slides.push(tmp.innerHTML);
  }

  document.body.removeChild(probe);
  document.head.removeChild(styleEl);

  return slides.length > 0 ? slides : [html];
}

export const XHSSlidePreview = forwardRef<
  XHSSlidePreviewMethods,
  XHSSlidePreviewProps
>(
  (
    {
      html,
      theme,
      authorName = "ChicPage 创作助手",
      authorAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Chic",
      tags = ["自媒体干货", "高效排版", "ChicPage"],
      showHeader = false,
      showFooter = true,
      hideMockUI = false,
      font = "system",
    },
    ref,
  ) => {
    const [slides, setSlides] = useState<string[]>([]);
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

    const displaySlides = slides.length > 0 ? slides : [html];
    // 计算位移，并在边缘滑动时增加阻尼感
    const translateX = (() => {
      const base = -current * XHS_CARD_W;
      if (current === 0 && dragOffset > 0) return base + dragOffset * 0.35;
      if (current === displaySlides.length - 1 && dragOffset < 0)
        return base + dragOffset * 0.35;
      return base + dragOffset;
    })();

    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getSlidesCount: () => displaySlides.length,
      goToSlide: (index: number) =>
        setCurrent(Math.max(0, Math.min(displaySlides.length - 1, index))),
      getCurrentSlide: () => current,
      goPrev: () => setCurrent((prev) => Math.max(0, prev - 1)),
      goNext: () =>
        setCurrent((prev) => Math.min(displaySlides.length - 1, prev + 1)),
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
            {displaySlides.map((slideHtml, i) => (
              <div
                key={i}
                className="xhs-slide-page"
                style={{
                  width: `${XHS_CARD_W}px`,
                  flexShrink: 0,
                  height: "100%",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  padding: `${PADDING_Y}px ${PADDING_X}px`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  id="xhs-content"
                  dangerouslySetInnerHTML={{ __html: slideHtml }}
                  style={{
                    width: "100%",
                    overflow: "hidden",
                  }}
                />
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
          {displaySlides.map((_, i) => (
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
