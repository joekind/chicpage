"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List, ListOrdered,
  Quote, Table,
  Heading1, Heading2, Minus,
  SeparatorHorizontal,
  Info, AlertCircle, AlertTriangle,
  Code2, Image as ImageIcon,
  CheckSquare, Keyboard, FolderUp,
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
  onInsertPageBreak?: () => void;
  onQuote: () => void;
  
  activePopup: string | null;
  setActivePopup: (popup: string | null) => void;
  toolbarRef?: React.RefObject<HTMLDivElement | null>;
}

export const MarkdownToolbar = ({
  onWrapText,
  onInsertText,
  onInsertAtLineStart,
  onInsertTable,
  onInsertImage,
  onImportMarkdown,
  onHeading,
  onSeparator,
  onInsertPageBreak,
  onQuote,
  activePopup,
  setActivePopup,
  toolbarRef,
}: MarkdownToolbarProps) => {
  const [hoverGrid, setHoverGrid] = React.useState({ r: 0, c: 0 });

  const btn = (icon: React.ReactNode, title: string, onClick: () => void, extra = "") =>
    <Button key={title} variant="ghost" size="icon" title={title}
      className={cn("size-8 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 hover:scale-110 active:scale-90 transition-all duration-300", extra)}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {icon}
    </Button>;

  const groupHeadings = [
    btn(<Heading1 className="size-4" />, "H1 / 主标题", () => onHeading(1)),
    btn(<Heading2 className="size-4" />, "H2 / 小标题", () => onHeading(2)),
  ];

  const groupInline = [
    btn(<Keyboard className="size-4" />,      "键盘按键",   () => onWrapText('<kbd>', '</kbd>')),

  ];

  const groupBlock = [
    btn(<Quote className="size-4" />,         "引用",       () => onQuote()),
    btn(<List className="size-4" />,          "无序列表",    () => onInsertAtLineStart('- ')),
    btn(<ListOrdered className="size-4" />,   "有序列表",    () => onInsertAtLineStart('1. ')),
    btn(<CheckSquare className="size-4" />,   "任务清单",    () => onInsertAtLineStart('- [ ] ')),
    btn(<Minus className="size-4" />,         "装饰分隔线",      () => onSeparator()),
    btn(<SeparatorHorizontal className="size-4" />, "强制分页符（<!--pagebreak-->）", () => onInsertPageBreak?.()),
    btn(<Code2 className="size-4" />,         "代码块",      () => onInsertText('\n```js\n\n```\n')),
  ];

  const groupMedia = [
    btn(<ImageIcon className="size-4" />,    "插入图片", () => onInsertImage?.()),
    btn(<FolderUp className="size-4" />, "导入 Markdown", () => onImportMarkdown?.()),
    <Button key="table" variant="ghost" size="icon" title="插入表格"
      className={cn("size-8 rounded-lg transition-all", activePopup === 'table' ? "bg-primary text-white border border-primary hover:bg-primary/90" : "hover:bg-slate-100 text-slate-600")}
      onMouseDown={(e) => {
        e.preventDefault();
        setActivePopup(activePopup === 'table' ? null : 'table');
      }}>
      <Table className="size-4" />
    </Button>,
  ];

  const groupCallouts = [
    btn(<Info className="size-4" />,          "提示盒 tip",     () => onInsertText('\n:::tip\n在这输入提示内容\n:::\n')),
    btn(<AlertCircle className="size-4" />,   "警告盒 warning", () => onInsertText('\n:::warning\n在这输入警告内容\n:::\n')),
    btn(<AlertTriangle className="size-4" />, "危险盒 danger",  () => onInsertText('\n:::danger\n在这输入危险内容\n:::\n')),
  ];

  const groups = [groupHeadings, groupInline, groupBlock, groupMedia, groupCallouts];

  return (
    <div ref={toolbarRef} className="toolbar-root w-full flex flex-col border-b border-[var(--border)] bg-[rgba(251,251,252,0.96)] backdrop-blur-md overflow-visible relative text-[var(--foreground)]">
      <div className="flex items-center justify-between px-6 py-1.5 flex-wrap gap-y-1.5 relative">
        <div className="flex items-center flex-wrap gap-y-1.5">
          {groups.map((group, i) => (
            <React.Fragment key={i}>
              <div className="flex gap-0.5">{group}</div>
              {i < groups.length - 1 && <div className="w-px h-5 bg-[var(--border)] mx-1.25" />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-1">
        </div>

      </div>

      {/* 表格选择面板 — 保持原来展开方式 */}
      <AnimatePresence>
        {activePopup === 'table' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="bg-[var(--background)] px-4 py-3 border-t border-[var(--border)]"
          >
            <div className="flex items-center gap-6">
              <div className="grid grid-cols-10 gap-1 bg-white p-2 rounded-xl border border-[var(--border)] shadow-sm"
                onMouseLeave={() => setHoverGrid({ r: 0, c: 0 })}>
                {Array.from({ length: 50 }).map((_, i) => {
                  const r = Math.floor(i / 10) + 1;
                  const c = (i % 10) + 1;
                  return (
                    <div key={i}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoverGrid({ r, c })}
                      onClick={() => onInsertTable(r, c)}
                      className={cn(
                        "size-4 cursor-pointer rounded-sm border transition-all duration-200",
                        r <= hoverGrid.r && c <= hoverGrid.c ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border)]"
                      )} />
                  );
                })}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted-foreground)]">表格规模</span>
                <span className="text-2xl font-black text-[var(--foreground)] tabular-nums">{hoverGrid.r} <span className="text-[var(--muted-foreground)] text-sm">×</span> {hoverGrid.c}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
