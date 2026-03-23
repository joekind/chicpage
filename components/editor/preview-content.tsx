"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PreviewContentProps {
  html: string;
  styleTheme: string;
  imgRadius: number;
  activeThemeCss: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PreviewContent = ({
  html,
  styleTheme,
  imgRadius,
  activeThemeCss,
  containerRef,
}: PreviewContentProps) => {
  return (
    <div
      ref={containerRef}
      className={cn(
        "prose prose-zinc max-w-none transition-all duration-500",
        styleTheme === "xhs" ? "prose-sm xhs-card-theme" : "prose-base"
      )}
      style={{ "--img-radius": `${imgRadius}px` } as React.CSSProperties}
    >
      <style>{`
        ${styleTheme !== "xhs" ? activeThemeCss : ""}
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
};
