"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Copy,
  Scissors,
  ClipboardPaste,
  Link,
  Image,
  Type,
  SeparatorHorizontal,
  Trash2
} from "lucide-react";

interface ContextMenuProps {
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
  onInsertHeading: () => void;
  onInsertSeparator: () => void;
  onInsertPageBreak: () => void;
  onDeleteLine: () => void;
  separatorLabel?: string;
  pageBreakLabel?: string;
  targetSelector?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  onCopy,
  onCut,
  onPaste,
  onInsertLink,
  onInsertImage,
  onInsertHeading,
  onInsertSeparator,
  onInsertPageBreak,
  onDeleteLine,
  separatorLabel = "插入分隔线",
  pageBreakLabel = "插入分页符",
  targetSelector = ".mdx-editor-container",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const isInScope = Boolean(target?.closest(targetSelector));
      if (!isInScope) {
        setIsVisible(false);
        return;
      }

      e.preventDefault();
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [targetSelector]);

  if (!isVisible) return null;

  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
  const padding = 10;
  const estimatedMenuWidth = 220;

  const clampedX = Math.min(
    Math.max(position.x, padding),
    viewportW - estimatedMenuWidth - padding,
  );
  const clampedY = Math.min(Math.max(position.y, padding), viewportH - 180);
  const maxMenuHeight = Math.max(180, viewportH - clampedY - padding);

  const menuItems = [
    { label: "复制", icon: Copy, action: onCopy, shortcut: "Ctrl+C" },
    { label: "剪切", icon: Scissors, action: onCut, shortcut: "Ctrl+X" },
    { label: "粘贴", icon: ClipboardPaste, action: onPaste, shortcut: "Ctrl+V" },
    { separator: true },
    { label: "插入链接", icon: Link, action: onInsertLink, shortcut: "Ctrl+K" },
    { label: "插入图片", icon: Image, action: onInsertImage },
    { label: "插入标题", icon: Type, action: onInsertHeading },
    { label: separatorLabel, icon: SeparatorHorizontal, action: onInsertSeparator },
    { label: pageBreakLabel, icon: SeparatorHorizontal, action: onInsertPageBreak },
    { separator: true },
    { label: "删除行", icon: Trash2, action: onDeleteLine, danger: true }
  ];

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-[9999] min-w-[180px] bg-white rounded-lg shadow-xl border border-zinc-200 py-1 overflow-y-auto",
        "animate-in fade-in-0 zoom-in-95"
      )}
      style={{
        left: clampedX,
        top: clampedY,
        maxHeight: maxMenuHeight
      }}
    >
      {menuItems.map((item, index) => {
        if ("separator" in item) {
          return <div key={index} className="h-px bg-zinc-200 my-1" />;
        }

        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={() => {
              item.action();
              setIsVisible(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors",
              "hover:bg-zinc-100",
              item.danger && "text-red-600 hover:bg-red-50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-zinc-400">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
