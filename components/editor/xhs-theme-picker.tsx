"use client";

import React from "react";
import { XHS_THEMES } from "@/lib/xhs-themes";
import { Check } from "lucide-react";

interface XHSThemePickerProps {
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const XHSThemePicker: React.FC<XHSThemePickerProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {XHS_THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelectTheme(theme.id)}
          className={`relative group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200 hover:bg-zinc-100 ${
            currentTheme === theme.id ? "bg-zinc-100 ring-2 ring-indigo-500 ring-offset-1" : ""
          }`}
        >
          <div
            className="w-10 h-10 rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-110"
            style={{ background: theme.preview }}
          />
          {currentTheme === theme.id && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
          <span className="text-[10px] text-zinc-600 font-medium truncate w-full text-center">
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
};
