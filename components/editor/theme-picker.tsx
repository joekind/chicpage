"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { WECHAT_THEMES } from "@/lib/themes";

// Visual swatches for each theme
const THEME_SWATCHES: Record<string, { bg: string; accent: string }> = {
  shaoshupai:  { bg: '#ffffff', accent: '#555555' },
  green:    { bg: '#f0faf4', accent: '#07c160' },
  elegant:  { bg: '#fdf9f3', accent: '#c8a96e' },
  tech:     { bg: '#1a1a2e', accent: '#7c83fd' },
  rose:     { bg: '#fff1f2', accent: '#be123c' },
};

interface ThemePickerProps {
  value: string;
  onChange: (id: string) => void;
  themes?: Array<{ id: string; name: string }>;
}

export const ThemePicker = ({ value, onChange, themes = WECHAT_THEMES }: ThemePickerProps) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {themes.map(theme => {
        const swatch = THEME_SWATCHES[theme.id] ?? { bg: '#fff', accent: '#333' };
        const isActive = value === theme.id;
        return (
          <button
            key={theme.id}
            title={theme.name}
            onClick={() => onChange(theme.id)}
            className={cn(
              "group relative flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all",
              isActive
                ? "ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50/50"
                : "hover:bg-zinc-100 ring-1 ring-zinc-200"
            )}
          >
            {/* Swatch */}
            <div
              className="w-6 h-6 rounded-md border border-zinc-200/80 shadow-sm overflow-hidden flex flex-col"
              style={{ background: swatch.bg }}
            >
              {/* Accent stripe */}
              <div className="w-full h-2" style={{ background: swatch.accent }} />
              {/* Fake text lines */}
              <div className="flex flex-col gap-0.5 p-0.5 mt-0.5">
                <div className="w-full h-0.5 rounded-full opacity-30" style={{ background: swatch.accent }} />
                <div className="w-3/4 h-0.5 rounded-full opacity-20" style={{ background: swatch.accent }} />
              </div>
            </div>
            <span className={cn(
              "text-[9px] font-bold leading-none",
              isActive ? "text-indigo-600" : "text-zinc-400"
            )}>
              {theme.name}
            </span>
          </button>

        );
      })}
    </div>
  );
};
