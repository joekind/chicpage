"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import { getThemeBackgroundStyle, type WechatTheme } from "@/lib/themes";

interface PreviewContentProps {
  html: string;
  styleTheme: string;
  imgRadius: number;
  activeThemeCss: string;
  activeTheme?: WechatTheme;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onImageWidthChange?: (imageIndex: number, widthPercent: number) => void;
}

export const PreviewContent = ({
  html,
  styleTheme,
  imgRadius,
  activeThemeCss,
  activeTheme,
  containerRef,
  onImageWidthChange,
}: PreviewContentProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    index: number;
    widthPercent: number;
    top: number;
    left: number;
  } | null>(null);

  const getControlPosition = (image: HTMLImageElement) => {
    const wrapper = contentRef.current?.parentElement?.parentElement;
    if (!wrapper) return { top: 0, left: 0 };

    const imageRect = image.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const controlWidth = 244;
    const left = Math.min(
      Math.max(imageRect.left - wrapperRect.left + imageRect.width / 2, controlWidth / 2 + 8),
      wrapperRect.width - controlWidth / 2 - 8,
    );

    return {
      top: imageRect.bottom - wrapperRect.top + 10,
      left,
    };
  };

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const images = Array.from(node.querySelectorAll("img"));
    images.forEach((image, index) => {
      const markdownImageIndex = Number(image.dataset.chicpageImageIndex ?? index);
      image.classList.add("chicpage-preview-image-selectable");
      image.classList.toggle("is-selected", selectedImage?.index === markdownImageIndex);
      image.dataset.imageIndex = String(markdownImageIndex);
    });
  }, [html, selectedImage]);

  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const image = (event.target as HTMLElement).closest("img");
    if (!image || !contentRef.current?.contains(image)) {
      setSelectedImage(null);
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const imageElement = image as HTMLImageElement;
    const index = Number(imageElement.dataset.imageIndex ?? 0);
    const width = imageElement.style.width;
    const widthPercent = width.endsWith("%") ? Number.parseInt(width, 10) : 100;
    setSelectedImage({
      index,
      widthPercent: Number.isFinite(widthPercent) ? widthPercent : 100,
      ...getControlPosition(imageElement),
    });
  };

  const themeContainerStyle: CSSProperties | undefined =
    styleTheme === "wechat" && activeTheme
      ? {
          ...getThemeBackgroundStyle(activeTheme),
          width: "100%",
          maxWidth: "677px",
          margin: "0 auto",
          minHeight: "100%",
          padding: 0,
        }
      : undefined;

  return (
    <div
      ref={containerRef}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest("img") && !target.closest("[data-image-width-control]")) {
          setSelectedImage(null);
        }
      }}
      className={cn(
        "prose prose-zinc relative max-w-none transition-all duration-500",
        styleTheme === "poster" ? "prose-sm poster-card-theme" : "prose-base"
      )}
      style={{ "--img-radius": `${imgRadius}px` } as React.CSSProperties}
    >
      <style>{`
        ${styleTheme !== "poster" ? activeThemeCss : ""}
        .chicpage-preview-image-selectable {
          cursor: pointer;
          transition: box-shadow 0.18s ease, outline-color 0.18s ease, filter 0.18s ease;
        }
        .chicpage-preview-image-selectable:hover {
          box-shadow: 0 0 0 2px rgba(24, 24, 27, 0.16);
        }
        .chicpage-preview-image-selectable.is-selected {
          outline: 2px solid rgba(24, 24, 27, 0.92);
          outline-offset: 3px;
          box-shadow: 0 12px 30px rgba(24, 24, 27, 0.16);
        }
        #chicpage blockquote {
          border: none !important;
          border-left: none !important;
          background: #f8fafc;
          border-radius: 12px;
        }
        #chicpage hr {
          border: none !important;
          height: 1px;
          background: #dde1e6;
          margin: 2rem 0;
        }
        .poster-card-theme .poster-h1 { color:var(--foreground); font-size:1.15rem; font-weight:900; text-align:center; margin:1.5rem 1rem 0.25rem; }
        .poster-card-theme .poster-divider { text-align:center; color:var(--border); font-size:0.8rem; margin-bottom:1.5rem; }
        .poster-card-theme .poster-h2 { color:var(--foreground); font-size:1.05rem; font-weight:800; margin:1.25rem 1rem 0.75rem; }
        .poster-card-theme table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        .poster-card-theme th { background: #f9f9f9; padding: 8px; border: 1px solid #eee; font-weight: 700; text-align: left; }
        .poster-card-theme td { padding: 8px; border: 1px solid #eee; color: #444; }
      `}</style>
      <div style={themeContainerStyle}>
        <div
          ref={contentRef}
          id="chicpage"
          onClick={handlePreviewClick}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {selectedImage && onImageWidthChange ? (
        <div
          data-image-width-control="true"
          className="absolute z-30 w-[244px] -translate-x-1/2 rounded-xl border border-zinc-950 bg-white px-3 py-2.5 text-zinc-950 shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
          style={{ top: selectedImage.top, left: selectedImage.left }}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-zinc-950">图片宽度</span>
            <span className="text-xs font-semibold tabular-nums text-zinc-950">
              {selectedImage.widthPercent}%
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            step="1"
            value={selectedImage.widthPercent}
            onChange={(event) => {
              const widthPercent = Number(event.target.value);
              const image = contentRef.current?.querySelector<HTMLImageElement>(
                `img[data-image-index="${selectedImage.index}"]`,
              );
              if (image) {
                image.style.width = `${widthPercent}%`;
                image.style.maxWidth = "100%";
                image.style.height = "auto";
              }
              setSelectedImage((current) =>
                current
                  ? {
                      ...current,
                      widthPercent,
                      ...(image ? getControlPosition(image) : {}),
                    }
                  : current,
              );
              onImageWidthChange(selectedImage.index, widthPercent);
            }}
            className="w-full accent-zinc-950"
            aria-label="图片宽度"
          />
        </div>
      ) : null}
    </div>
  );
};
