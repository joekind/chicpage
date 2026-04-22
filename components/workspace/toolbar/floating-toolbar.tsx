"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlighter, Eraser, Bold, Italic, Link as LinkIcon, Strikethrough, Code, Superscript, Subscript } from "lucide-react";

const HIGHLIGHT_COLORS = [
  { label: '黄色', value: '#fef08a' },
  { label: '绿色', value: '#bbf7d0' },
  { label: '蓝色', value: '#bfdbfe' },
  { label: '粉色', value: '#fbcfe8' },
  { label: '橙色', value: '#fed7aa' },
  { label: '紫色', value: '#e9d5ff' },
];

interface FloatingToolbarProps {
  coords: { top: number; left: number; width: number; height: number } | null;
  onWrapText: (before: string, after?: string) => void;
  onBold: () => void;
  isVisible: boolean;
}

export const FloatingToolbar = ({ coords, onWrapText, onBold, isVisible }: FloatingToolbarProps) => {
  const [showColors, setShowColors] = React.useState(false);

  if (!coords) return null;

  const ESTIMATED_TOOLBAR_W = showColors ? 340 : 420;
  const TOOLBAR_H = 44;
  const GAP = 8;
  const VIEWPORT_PADDING = 8;
  const centerX = coords.left + coords.width / 2;
  const preferredTop = coords.top - TOOLBAR_H - GAP;
  const placeBelow = preferredTop < VIEWPORT_PADDING;
  const top = placeBelow ? coords.top + coords.height + GAP : preferredTop;
  const minLeft = ESTIMATED_TOOLBAR_W / 2 + VIEWPORT_PADDING;
  const maxLeft = window.innerWidth - ESTIMATED_TOOLBAR_W / 2 - VIEWPORT_PADDING;
  const clampedCenterX = Math.min(Math.max(centerX, minLeft), maxLeft);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          style={{
            position: 'fixed',
            top,
            left: clampedCenterX,
            transform: "translateX(-50%)",
            zIndex: 120,
          }}
          className="flex items-center gap-1 bg-[rgba(39,39,42,0.96)] text-white rounded-full p-1.5 shadow-2xl border border-white/10 backdrop-blur-md"
        >
          {!showColors ? (
            <div className="flex items-center">
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onBold}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/85"
                title="加粗"
              >
                <Bold className="size-4" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onWrapText('*')}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/85"
                title="斜体"
              >
                <Italic className="size-4" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onWrapText('~~')}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/85"
                title="删除线"
              >
                <Strikethrough className="size-3.5" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onWrapText('`')}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/80"
                title="行内代码"
              >
                <Code className="size-4" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onWrapText('[', '](url)')}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/80"
                title="链接"
              >
                <LinkIcon className="size-4" />
              </button>

              <div className="w-px h-4 bg-white/20 mx-1" />

              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onWrapText('<sup>', '</sup>')}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/80"
                title="上标"
              >
                <Superscript className="size-3.5" />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onWrapText('<sub>', '</sub>')}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/80"
                title="下标"
              >
                <Subscript className="size-3.5" />
              </button>

              <div className="w-px h-4 bg-white/20 mx-1" />

              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowColors(true)}
                className="size-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-white/70 font-bold"
                title="荧光笔"
              >
                <Highlighter className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-left-2 duration-300">
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowColors(false)}
                className="size-7 flex items-center justify-center hover:bg-white/10 rounded-full mr-1 text-white/70"
              >
                <div className="size-1 bg-white/80 rounded-full mx-0.5" />
                <div className="size-1 bg-white/80 rounded-full mx-0.5" />
              </button>
              {HIGHLIGHT_COLORS.map(c => (
                <button
                  key={c.value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onWrapText(`<mark style="background:${c.value}">`, '</mark>');
                    setShowColors(false);
                  }}
                  className="size-6 rounded-full border border-white/20 hover:scale-125 transition-transform shadow-sm"
                  style={{ backgroundColor: c.value }}
                />
              ))}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onWrapText('', '');
                  setShowColors(false);
                }}
                className="size-6 rounded-full border border-dashed border-white/20 flex items-center justify-center hover:bg-white/10 text-white/70"
              >
                <Eraser className="size-3" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
