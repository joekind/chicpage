"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Undo,
  Redo,
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
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
  onInsertHeading: () => void;
  onInsertSeparator: () => void;
  onDeleteLine: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  onUndo,
  onRedo,
  onCopy,
  onCut,
  onPaste,
  onInsertLink,
  onInsertImage,
  onInsertHeading,
  onInsertSeparator,
  onDeleteLine
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
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
  }, []);

  if (!isVisible) return null;

  const menuItems = [
    { label: "撤销", icon: Undo, action: onUndo, shortcut: "Ctrl+Z" },
    { label: "重做", icon: Redo, action: onRedo, shortcut: "Ctrl+Y" },
    { separator: true },
    { label: "复制", icon: Copy, action: onCopy, shortcut: "Ctrl+C" },
    { label: "剪切", icon: Scissors, action: onCut, shortcut: "Ctrl+X" },
    { label: "粘贴", icon: ClipboardPaste, action: onPaste, shortcut: "Ctrl+V" },
    { separator: true },
    { label: "插入链接", icon: Link, action: onInsertLink, shortcut: "Ctrl+K" },
    { label: "插入图片", icon: Image, action: onInsertImage },
    { label: "插入标题", icon: Type, action: onInsertHeading },
    { label: "插入分隔线", icon: SeparatorHorizontal, action: onInsertSeparator },
    { separator: true },
    { label: "删除行", icon: Trash2, action: onDeleteLine, danger: true }
  ];

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed z-[9999] min-w-[180px] bg-white rounded-lg shadow-xl border border-zinc-200 py-1 overflow-hidden",
        "animate-in fade-in-0 zoom-in-95"
      )}
      style={{
        left: Math.min(position.x, window.innerWidth - 200),
        top: Math.min(position.y, window.innerHeight - 300)
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
