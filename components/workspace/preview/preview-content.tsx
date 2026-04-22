"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import type { WechatTheme } from "@/lib/themes";
import { getThemeBackgroundStyle } from "@/lib/theme-background";

interface PreviewContentProps {
  html: string;
  styleTheme: string;
  imgRadius: number;
  activeThemeCss: string;
  activeTheme?: WechatTheme;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PreviewContent = ({
  html,
  styleTheme,
  imgRadius,
  activeThemeCss,
  activeTheme,
  containerRef,
}: PreviewContentProps) => {
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
      className={cn(
        "prose prose-zinc max-w-none transition-all duration-500",
        styleTheme === "poster" ? "prose-sm poster-card-theme" : "prose-base"
      )}
      style={{ "--img-radius": `${imgRadius}px` } as React.CSSProperties}
    >
      <style>{`
        ${styleTheme !== "poster" ? activeThemeCss : ""}
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
        <div id="chicpage" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};
