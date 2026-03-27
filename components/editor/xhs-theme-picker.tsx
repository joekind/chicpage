"use client";

import React from "react";
import { XHS_THEMES } from "@/lib/xhs-themes";
import { cn } from "@/lib/utils";

interface XHSThemePickerProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const XHSThemePicker: React.FC<XHSThemePickerProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-2">
      {XHS_THEMES.map((theme) => {
        const isActive = currentTheme === theme.id;
        const isElegant = theme.id === 'elegant';
        const isMagazine = theme.id === 'magazine';

        return (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className="group relative flex flex-col items-center gap-2 transition-all duration-300 ring-offset-2 rounded-2xl"
          >
            <div
              className={cn(
                "aspect-square w-full rounded-xl border border-zinc-200/60 shadow-sm transition-all duration-500 overflow-hidden relative",
                isActive ? "ring-2 ring-indigo-500 border-transparent shadow-lg scale-[1.05]" : "hover:border-zinc-300 hover:scale-[1.05] bg-zinc-50"
              )}
              style={{ background: theme.preview }}
            >
              {/* Mini Preview Decoration */}
              <div className="p-1 space-y-1 opacity-20">
                <div className="w-full h-0.5 rounded-full bg-zinc-900" />
                <div className="w-3/4 h-0.5 rounded-full bg-zinc-900" />
              </div>
              
              {/* Signature Character */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center text-xl font-black opacity-[0.06] pointer-events-none select-none",
                isElegant ? "font-serif" : "font-sans"
              )}>
                {isElegant ? 'A' : (isMagazine ? 'M' : 'D')}
              </div>
            </div>

            {isActive && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
            
            <span className={cn(
              "text-[9px] font-black uppercase tracking-tight transition-colors truncate w-full text-center",
              isActive ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600"
            )}>
              {theme.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
