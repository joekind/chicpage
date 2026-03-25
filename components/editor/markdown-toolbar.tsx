"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold, Italic, Strikethrough,
  Link as LinkIcon, List, ListOrdered,
  Quote, Table, Wand2,
  Heading1, Heading2, Minus,
  Highlighter, Info, AlertCircle, AlertTriangle,
  Code, Code2, Image, Eraser,
  Superscript, Subscript, CheckSquare, Keyboard, FolderUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarkdownToolbarProps {
  onWrapText: (before: string, after?: string) => void;
  onInsertText: (text: string) => void;
  onInsertAtLineStart: (prefix: string) => void;
  onApplyPangu: () => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertImage?: () => void;
  onImportMarkdown?: () => void;
  
  // High-level theme-aware handlers
  onHeading: (level: 1 | 2) => void;
  onBold: () => void;
  onSeparator: () => void;
  onQuote: () => void;
  
  activePopup: string | null;
  setActivePopup: (popup: string | null) => void;
  toolbarRef?: React.RefObject<HTMLDivElement | null>;
}

const HIGHLIGHT_COLORS = [
  { label: '黄色', value: '#fef08a' },
  { label: '绿色', value: '#bbf7d0' },
  { label: '蓝色', value: '#bfdbfe' },
  { label: '粉色', value: '#fbcfe8' },
  { label: '橙色', value: '#fed7aa' },
  { label: '紫色', value: '#e9d5ff' },
];

export const MarkdownToolbar = ({
  onWrapText,
  onInsertText,
  onInsertAtLineStart,
  onApplyPangu,
  onInsertTable,
  onInsertImage,
  onImportMarkdown,
  onHeading,
  onBold,
  onSeparator,
  onQuote,
  activePopup,
  setActivePopup,
  toolbarRef,
}: MarkdownToolbarProps) => {
  const [hoverGrid, setHoverGrid] = React.useState({ r: 0, c: 0 });
  const [customColor, setCustomColor] = React.useState('');
  const highlightBtnRef = useRef<HTMLButtonElement>(null);
  const [bubbleLeft, setBubbleLeft] = React.useState(0);

  // 计算气泡位置
  useEffect(() => {
    if (activePopup === 'highlight' && highlightBtnRef.current) {
      const rect = highlightBtnRef.current.getBoundingClientRect();
      const parentRect = highlightBtnRef.current.closest('.toolbar-root')?.getBoundingClientRect();
      setBubbleLeft(rect.left - (parentRect?.left ?? 0));
    }
  }, [activePopup]);

  const btn = (icon: React.ReactNode, title: string, onClick: () => void, extra = "") =>
    <Button key={title} variant="ghost" size="icon" title={title}
      className={cn("size-8 rounded-lg hover:bg-zinc-100 text-zinc-600", extra)}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {icon}
    </Button>;

  const applyHighlight = (color: string) => {
    onWrapText(`<mark style="background:${color}">`, '</mark>');
    setActivePopup(null);
    setCustomColor('');
  };

  const groupHeadings = [
    btn(<Heading1 className="size-4" />, "H1 / 主标题", () => onHeading(1)),
    btn(<Heading2 className="size-4" />, "H2 / 小标题", () => onHeading(2)),
  ];

  const groupInline = [
    btn(<Bold className="size-4" />,          "加粗",       () => onBold()),
    btn(<Italic className="size-4" />,        "斜体",       () => onWrapText('*')),
    btn(<Strikethrough className="size-4" />, "删除线",     () => onWrapText('~~')),
    btn(<Code className="size-4" />,          "行内代码",   () => onWrapText('`'), "hover:bg-violet-50 text-violet-600"),
    btn(<Keyboard className="size-4" />,      "键盘按键",   () => onWrapText('<kbd>', '</kbd>')),
    btn(<Superscript className="size-4" />,   "上标",       () => onWrapText('<sup>', '</sup>'), "hover:bg-sky-50 text-sky-600"),
    btn(<Subscript className="size-4" />,     "下标",       () => onWrapText('<sub>', '</sub>'), "hover:bg-sky-50 text-sky-600"),
    <button
      key="highlight"
      ref={highlightBtnRef}
      title="荧光笔"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setActivePopup(activePopup === 'highlight' ? null : 'highlight')}
      className={cn(
        "size-8 rounded-lg transition-all flex items-center justify-center",
        activePopup === 'highlight' ? "bg-amber-100 text-amber-600" : "hover:bg-amber-50 text-amber-500"
      )}>
      <Highlighter className="size-4" />
    </button>,
  ];

  const groupBlock = [
    btn(<Quote className="size-4" />,         "引用",       () => onQuote()),
    btn(<List className="size-4" />,          "无序列表",    () => onInsertAtLineStart('- ')),
    btn(<ListOrdered className="size-4" />,   "有序列表",    () => onInsertAtLineStart('1. ')),
    btn(<CheckSquare className="size-4" />,   "任务清单",    () => onInsertAtLineStart('- [ ] '), "hover:bg-green-50 text-green-600"),
    btn(<Minus className="size-4" />,         "分割线",      () => onSeparator()),
    btn(<Code2 className="size-4" />,         "代码块",      () => onInsertText('\n```js\n\n```\n'), "hover:bg-violet-50 text-violet-600"),
  ];

  const groupMedia = [
    btn(<LinkIcon className="size-4" />, "超链接",  () => onWrapText('[', '](url)'), "hover:bg-indigo-50 text-indigo-600"),
    btn(<Image className="size-4" />,    "插入图片", () => onInsertImage?.(), "hover:bg-indigo-50 text-indigo-600"),
    btn(<FolderUp className="size-4" />, "导入 Markdown", () => onImportMarkdown?.(), "hover:bg-indigo-50 text-indigo-600"),
    <Button key="table" variant="ghost" size="icon" title="插入表格"
      className={cn("size-8 rounded-lg transition-all", activePopup === 'table' ? "bg-indigo-50 text-indigo-600" : "hover:bg-zinc-100 text-zinc-600")}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setActivePopup(activePopup === 'table' ? null : 'table')}>
      <Table className="size-4" />
    </Button>,
  ];

  const groupCallouts = [
    btn(<Info className="size-4" />,          "提示盒 tip",     () => onInsertText('\n:::tip\n在这输入提示内容\n:::\n'), "hover:bg-blue-50 text-blue-600"),
    btn(<AlertCircle className="size-4" />,   "警告盒 warning", () => onInsertText('\n:::warning\n在这输入警告内容\n:::\n'), "hover:bg-orange-50 text-orange-500"),
    btn(<AlertTriangle className="size-4" />, "危险盒 danger",  () => onInsertText('\n:::danger\n在这输入危险内容\n:::\n'), "hover:bg-red-50 text-red-600"),
  ];

  const groups = [groupHeadings, groupInline, groupBlock, groupMedia, groupCallouts];

  return (
    <div ref={toolbarRef} className="toolbar-root w-full flex flex-col border-b border-zinc-100 bg-white/95 backdrop-blur-md overflow-visible relative">
      <div className="flex items-center justify-between px-6 py-1.5 flex-wrap gap-y-1 relative">
        <div className="flex items-center flex-wrap gap-y-1">
          {groups.map((group, i) => (
            <React.Fragment key={i}>
              <div className="flex gap-0.5">{group}</div>
              {i < groups.length - 1 && <div className="w-px h-5 bg-zinc-100 mx-1.5" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-2">
        </div>

        {/* 荧光笔气泡 — 绝对定位，从按钮下方弹出 */}
        <AnimatePresence>
          {activePopup === 'highlight' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ left: Math.max(0, bubbleLeft - 8) }}
              className="absolute top-full mt-1 z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl px-4 py-3 min-w-max"
            >
              {/* 小三角 */}
              <div className="absolute -top-1.5 left-6 size-3 bg-white border-l border-t border-zinc-200 rotate-45" />
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-2">
                  {HIGHLIGHT_COLORS.map(c => (
                    <button key={c.value} title={c.label}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyHighlight(c.value)}
                      className="size-7 rounded-full border-2 border-white shadow-sm hover:scale-110 active:scale-95 transition-transform ring-1 ring-zinc-200"
                      style={{ backgroundColor: c.value }} />
                  ))}
                </div>
                <div className="w-px h-5 bg-zinc-100" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-zinc-400 font-mono">#</span>
                  <input
                    type="text"
                    placeholder="自定义"
                    maxLength={6}
                    value={customColor.replace('#', '')}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const color = `#${customColor.replace('#', '')}`;
                        if (/^#[0-9a-fA-F]{3,6}$/.test(color)) applyHighlight(color);
                      }
                    }}
                    className="w-20 h-7 px-2 text-[12px] border border-zinc-200 rounded-lg bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-300 font-mono"
                  />
                  {customColor.length >= 3 && (
                    <div className="size-5 rounded-full border border-zinc-200 flex-shrink-0"
                      style={{ backgroundColor: `#${customColor.replace('#', '')}` }} />
                  )}
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const color = `#${customColor.replace('#', '')}`;
                      if (/^#[0-9a-fA-F]{3,6}$/.test(color)) applyHighlight(color);
                    }}
                    className="h-7 px-3 text-[11px] font-bold bg-amber-400 text-white rounded-lg hover:bg-amber-500 active:scale-95 transition-all">
                    应用
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 表格选择面板 — 保持原来展开方式 */}
      <AnimatePresence>
        {activePopup === 'table' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="bg-zinc-50/50 px-4 py-3 border-t border-zinc-100"
          >
            <div className="flex items-center gap-6">
              <div className="grid grid-cols-10 gap-1 bg-white p-2 rounded-xl border border-zinc-100 shadow-sm"
                onMouseLeave={() => setHoverGrid({ r: 0, c: 0 })}>
                {[1,2,3,4,5].map(r => (
                  <div key={r} className="flex gap-1">
                    {[1,2,3,4,5,6,7,8,9,10].map(c => (
                      <div key={c}
                        onMouseEnter={() => setHoverGrid({ r, c })}
                        onClick={() => onInsertTable(r, c)}
                        className={cn(
                          "size-4 cursor-pointer rounded-sm border transition-all duration-200",
                          r <= hoverGrid.r && c <= hoverGrid.c ? "bg-indigo-500 border-indigo-600" : "border-zinc-200"
                        )} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">表格规模</span>
                <span className="text-2xl font-black text-indigo-500 tabular-nums">{hoverGrid.r} <span className="text-zinc-300 text-sm">×</span> {hoverGrid.c}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
