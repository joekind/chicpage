'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bold,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Code2,
  Eraser,
  FileUp,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Keyboard,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Plus,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Table2,
  TriangleAlert,
  Undo2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { EditorMethods, SelectionInfo } from '@/components/workspace/editor/mdx-editor';
import { getReadInfo } from '@/lib/content';
import { CODE_BLOCK_SNIPPET } from '@/lib/editor/commands';
import { cn } from '@/lib/utils';

const MDXEditor = dynamic(() => import('@/components/workspace/editor/mdx-editor'), { ssr: false });

interface MobileEditorPaneProps {
  isActive: boolean;
  markdown: string;
  editorRef: React.RefObject<EditorMethods | null>;
  selection: SelectionInfo | null;
  isUploading: boolean;
  uploadNotice?: {
    type: 'loading' | 'success' | 'error';
    message: string;
  } | null;
  onChange: (markdown: string) => void;
  onPaste: (event: React.ClipboardEvent | ClipboardEvent) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageFile: (file: File) => void;
  onSelectionChange: (info: SelectionInfo) => void;
  onPushHistory?: (markdown?: string) => void;
  onHeading: (level: 1 | 2) => void;
  onBold: () => void;
  onQuote: () => void;
  onSeparator: () => void;
  onInsertPageBreak: () => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertAtLineStart: (prefix: string) => void;
  onInsertText: (text: string) => void;
  onWrapText: (before: string, after?: string) => void;
  onInsertImage: () => void;
  onImportMarkdown: () => void;
  onInsertLink: () => void;
  onClearFormatting: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

function ToolbarButton({
  title,
  children,
  onClick,
  active,
}: {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='icon-sm'
      title={title}
      className={cn(
        'rounded-xl border border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-foreground',
        active && 'border-border bg-background text-foreground shadow-sm',
      )}
      onMouseDown={event => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className='flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-3 py-2'>
      <span className='text-sm font-semibold text-foreground'>{label}</span>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='rounded-xl'
          onClick={() => onChange(Math.max(1, value - 1))}
        >
          <Minus data-icon='inline-start' />
        </Button>
        <span className='w-8 text-center text-sm font-black tabular-nums'>{value}</span>
        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='rounded-xl'
          onClick={() => onChange(Math.min(10, value + 1))}
        >
          <Plus data-icon='inline-start' />
        </Button>
      </div>
    </div>
  );
}

export function MobileEditorPane({
  isActive,
  markdown,
  editorRef,
  selection,
  isUploading,
  uploadNotice,
  onChange,
  onPaste,
  onFileUpload,
  onImageFile,
  onSelectionChange,
  onPushHistory,
  onHeading,
  onBold,
  onQuote,
  onSeparator,
  onInsertPageBreak,
  onInsertTable,
  onInsertAtLineStart,
  onInsertText,
  onWrapText,
  onInsertImage,
  onImportMarkdown,
  onInsertLink,
  onClearFormatting,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: MobileEditorPaneProps) {
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const { wordCount, readTime } = useMemo(() => getReadInfo(markdown), [markdown]);
  const uploadNoticeConfig = uploadNotice
    ? uploadNotice.type === 'success'
      ? {
          icon: <CheckCircle2 data-icon='inline-start' />,
          className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        }
      : uploadNotice.type === 'error'
        ? {
            icon: <TriangleAlert data-icon='inline-start' />,
            className: 'border-red-200 bg-red-50 text-red-700',
          }
        : {
            icon: <Loader2 data-icon='inline-start' className='animate-spin' />,
            className: 'border-border bg-card text-foreground',
          }
    : null;

  const primaryTools = useMemo(
    () => [
      {
        title: 'H1 / 主标题',
        icon: <Heading1 data-icon='inline-start' />,
        action: () => onHeading(1),
      },
      {
        title: 'H2 / 小标题',
        icon: <Heading2 data-icon='inline-start' />,
        action: () => onHeading(2),
      },
      {
        title: '键盘按键',
        icon: <Keyboard data-icon='inline-start' />,
        action: () => onWrapText('<kbd>', '</kbd>'),
      },
      {
        title: '引用',
        icon: <Quote data-icon='inline-start' />,
        action: onQuote,
      },
      {
        title: '无序列表',
        icon: <List data-icon='inline-start' />,
        action: () => onInsertAtLineStart('- '),
      },
      {
        title: '有序列表',
        icon: <ListOrdered data-icon='inline-start' />,
        action: () => onInsertAtLineStart('1. '),
      },
      {
        title: '任务清单',
        icon: <CheckSquare data-icon='inline-start' />,
        action: () => onInsertAtLineStart('- [ ] '),
      },
    ],
    [onHeading, onInsertAtLineStart, onQuote, onWrapText],
  );
  const secondaryTools = useMemo(
    () => [
      {
        title: '装饰分隔线',
        icon: <Minus data-icon='inline-start' />,
        action: onSeparator,
      },
      {
        title: '分页符',
        icon: <SeparatorHorizontal data-icon='inline-start' />,
        action: onInsertPageBreak,
      },
      {
        title: '代码块',
        icon: <Code2 data-icon='inline-start' />,
        action: () => onInsertText(CODE_BLOCK_SNIPPET),
      },
      {
        title: '插入图片',
        icon: <ImagePlus data-icon='inline-start' />,
        action: onInsertImage,
      },
      {
        title: '导入 Markdown',
        icon: <FileUp data-icon='inline-start' />,
        action: onImportMarkdown,
      },
      {
        title: '插入表格',
        icon: <Table2 data-icon='inline-start' />,
        action: () => setIsTableDrawerOpen(true),
      },
    ],
    [onImportMarkdown, onInsertImage, onInsertPageBreak, onInsertText, onSeparator],
  );

  return (
    <div className='flex h-full flex-col overflow-hidden bg-background'>
      <div className='border-b border-border bg-card/88 backdrop-blur-xl'>
        <div className='flex items-start gap-1 px-3 py-2'>
          <div className='min-w-0 flex-1'>
            <div className='grid grid-cols-7 gap-1'>
              {primaryTools.map(tool => (
                <ToolbarButton key={tool.title} title={tool.title} onClick={tool.action}>
                  {tool.icon}
                </ToolbarButton>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {isToolbarExpanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className='overflow-hidden'
                >
                  <div className='mt-1 grid grid-cols-7 gap-1'>
                    {secondaryTools.map(tool => (
                      <ToolbarButton key={tool.title} title={tool.title} onClick={tool.action}>
                        {tool.icon}
                      </ToolbarButton>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <ToolbarButton
            title={isToolbarExpanded ? '收起工具栏' : '展开工具栏'}
            active={isToolbarExpanded}
            onClick={() => setIsToolbarExpanded(current => !current)}
          >
            {isToolbarExpanded ? (
              <ChevronUp data-icon='inline-start' />
            ) : (
              <ChevronDown data-icon='inline-start' />
            )}
          </ToolbarButton>
        </div>
      </div>

      <div
        className='relative flex-1 overflow-hidden'
        onDragOver={event => event.preventDefault()}
        onDrop={event => {
          event.preventDefault();
          Array.from(event.dataTransfer.files).forEach(onImageFile);
        }}
        onPaste={onPaste}
      >
        <AnimatePresence>
          {uploadNotice && uploadNoticeConfig ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={cn(
                'absolute left-3 right-3 top-3 z-20 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm',
                uploadNoticeConfig.className,
              )}
            >
              {uploadNoticeConfig.icon}
              <span className='truncate'>{uploadNotice.message}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <input
          id='mobile-md-import-input'
          type='file'
          accept='.md,.markdown'
          className='hidden'
          onChange={onFileUpload}
        />

        <MDXEditor
          ref={editorRef}
          markdown={markdown}
          onChange={onChange}
          onPaste={onPaste}
          onSelectionChange={onSelectionChange}
          onPushHistory={onPushHistory}
        />
      </div>

      <div className='relative flex h-[61px] shrink-0 items-center justify-center border-t border-border bg-card/90 px-3 text-[11px] font-medium text-muted-foreground backdrop-blur-xl'>
        <div className='absolute left-3 flex min-w-0 items-center'>
          {isUploading ? (
            <span className='flex items-center gap-1.5 text-foreground'>
              <Loader2 data-icon='inline-start' className='animate-spin' />
              处理中
            </span>
          ) : null}
        </div>
        <div className='flex min-w-0 items-center gap-3'>
          <span className='shrink-0'>全文 {wordCount} 字</span>
          <span className='shrink-0'>预计阅读 {readTime} 分钟</span>
        </div>
        <div className='absolute right-3 flex shrink-0 items-center gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            title='上一步'
            disabled={!canUndo}
            className={cn(
              'rounded-lg hover:bg-background hover:text-foreground',
              canUndo ? 'text-muted-foreground' : 'text-muted-foreground/35',
            )}
            onClick={onUndo}
          >
            <Undo2 data-icon='inline-start' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            title='下一步'
            disabled={!canRedo}
            className={cn(
              'rounded-lg hover:bg-background hover:text-foreground',
              canRedo ? 'text-muted-foreground' : 'text-muted-foreground/35',
            )}
            onClick={onRedo}
          >
            <Redo2 data-icon='inline-start' />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isActive && selection && !selection.empty ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className='fixed inset-x-3 bottom-[86px] z-40 rounded-2xl border border-border bg-popover/96 p-2 text-popover-foreground shadow-2xl backdrop-blur-xl'
          >
            <div className='flex items-center justify-between gap-1'>
              <ToolbarButton title='加粗' onClick={onBold}>
                <Bold data-icon='inline-start' />
              </ToolbarButton>
              <ToolbarButton title='斜体' onClick={() => onWrapText('*')}>
                <Italic data-icon='inline-start' />
              </ToolbarButton>
              <ToolbarButton title='链接' onClick={onInsertLink}>
                <LinkIcon data-icon='inline-start' />
              </ToolbarButton>
              <ToolbarButton title='清除格式' onClick={onClearFormatting}>
                <Eraser data-icon='inline-start' />
              </ToolbarButton>
              <ToolbarButton title='关闭' onClick={() => editorRef.current?.focus()}>
                <X data-icon='inline-start' />
              </ToolbarButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Drawer open={isTableDrawerOpen} onOpenChange={setIsTableDrawerOpen}>
        <DrawerContent className='rounded-t-[28px]'>
          <DrawerHeader className='px-4 pb-3 pt-4 text-left'>
            <DrawerTitle>插入表格</DrawerTitle>
            <DrawerDescription>选择行数和列数，插入后面板会自动关闭。</DrawerDescription>
          </DrawerHeader>
          <div className='flex flex-col gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
            <Stepper label='行数' value={tableRows} onChange={setTableRows} />
            <Stepper label='列数' value={tableCols} onChange={setTableCols} />
            <Button
              type='button'
              className='h-11 rounded-2xl'
              onClick={() => {
                onInsertTable(tableRows, tableCols);
                setIsTableDrawerOpen(false);
              }}
            >
              插入 {tableRows} x {tableCols} 表格
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
