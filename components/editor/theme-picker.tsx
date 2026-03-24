"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { WECHAT_THEMES } from "@/lib/themes";

// Visual swatches for each theme
const THEME_SWATCHES: Record<string, { bg: string; accent: string }> = {
  default:   { bg: '#ffffff', accent: '#6366f1' },
  elegant:   { bg: '#fdfaf6', accent: '#c8a96e' },
  magazine:  { bg: '#ffffff', accent: '#1a1a1a' },
  shaoshupai: { bg: '#ffffff', accent: '#555555' },
  green:     { bg: '#f0faf4', accent: '#07c160' },
  tech:      { bg: '#1a1a2e', accent: '#7c83fd' },
  rose:      { bg: '#fff1f2', accent: '#be123c' },
};

interface ThemePickerProps {
  value: string;
  onChange: (id: string) => void;
  themes?: Array<{ id: string; name: string }>;
}

export const ThemePicker = ({ value, onChange, themes = WECHAT_THEMES }: ThemePickerProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {themes.map(theme => {
        const swatch = THEME_SWATCHES[theme.id] ?? { bg: '#fff', accent: '#333' };
        const isActive = value === theme.id;
        const isElegant = theme.id === 'elegant';
        const isMagazine = theme.id === 'magazine';

        return (
          <button
            key={theme.id}
            title={theme.name}
            onClick={() => onChange(theme.id)}
            className={cn(
              "group relative flex flex-col items-center gap-2 p-1 transition-all duration-300 ease-out",
              isActive
                ? "scale-105"
                : "hover:scale-105"
            )}
          >
            {/* Swatch Card */}
            <div
              className={cn(
                "w-10 h-12 rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col relative transition-all duration-300",
                isActive ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg" : "hover:border-zinc-300"
              )}
              style={{ background: swatch.bg }}
            >
              <div className="w-full h-1.5" style={{ background: swatch.accent }} />
              <div className="flex flex-col gap-1 p-1.5 mt-0.5">
                <div className="w-full h-0.5 rounded-full opacity-20" style={{ background: swatch.accent }} />
                <div className="w-3/4 h-0.5 rounded-full opacity-10" style={{ background: swatch.accent }} />
              </div>
              <div className={cn(
                "absolute bottom-0 right-1 text-lg font-black opacity-[0.05] pointer-events-none select-none",
                isElegant ? "font-serif" : "font-sans"
              )}>
                {isElegant ? 'A' : (isMagazine ? 'M' : 'D')}
              </div>
              
              {isActive && (
                <div className="absolute top-2.5 right-1 size-2.5 bg-indigo-500 rounded-full border border-white flex items-center justify-center">
                  <div className="size-1 bg-white rounded-full" />
                </div>
              )}
            </div>
            
            <span className={cn(
              "text-[9px] font-black uppercase tracking-tight leading-none transition-colors",
              isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-500"
            )}>
              {theme.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
