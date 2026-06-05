'use client';

import Image from 'next/image';
import {
  Check,
  Copy,
  Download,
  FileCode,
  FileText,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  Palette,
  Type,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { StyleTheme } from '@/lib/editor/commands';
import {
  getThemeBackgroundStyle,
  getThemeTextureLayer,
  POSTER_FONTS,
  POSTER_THEMES,
  WECHAT_THEMES,
  type PosterTheme,
  type WechatTheme,
} from '@/lib/themes';
import { cn } from '@/lib/utils';
import type { CopyStatus } from '@/types';
import type { MobilePanel } from '@/types/mobile';

const segmentedButtonClassName =
  'rounded-lg text-muted-foreground hover:bg-background hover:text-foreground';
const segmentedActiveClassName = 'border border-border bg-background text-foreground shadow-sm';
const iconButtonClassName =
  'rounded-xl border-border bg-background text-muted-foreground shadow-xs hover:bg-muted hover:text-foreground';
const activeIconButtonClassName =
  'border-border bg-background text-foreground shadow-sm ring-1 ring-border';

interface MobileTopBarProps {
  panel: MobilePanel;
  styleTheme: StyleTheme;
  wechatTheme: string;
  posterTheme: string;
  posterFont: string;
  showWordCount: boolean;
  copyStatus: CopyStatus;
  exportStatus: 'idle' | 'success' | 'error';
  isExportingPoster: boolean;
  exportProgress?: { current: number; total: number };
  onCopy: () => void;
  onStyleThemeChange: (theme: StyleTheme) => void;
  onWechatThemeChange: (theme: string) => void;
  onPosterThemeChange: (theme: string) => void;
  onPosterFontChange: (font: string) => void;
  onShowWordCountChange: (show: boolean) => void;
  onExportHtml: () => Promise<void>;
  onExportMarkdown: () => Promise<void>;
  onOpenPosterExportPreview: () => Promise<void> | void;
}

function ModeSwitch({
  styleTheme,
  onStyleThemeChange,
}: {
  styleTheme: StyleTheme;
  onStyleThemeChange: (theme: StyleTheme) => void;
}) {
  return (
    <div className='flex h-9 shrink-0 items-center rounded-xl border border-border bg-muted p-0.5'>
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        title='公众号模式'
        onClick={() => onStyleThemeChange('wechat')}
        className={cn(
          segmentedButtonClassName,
          styleTheme === 'wechat' && segmentedActiveClassName,
        )}
      >
        <MessageCircle data-icon='inline-start' />
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        title='贴图模式'
        onClick={() => onStyleThemeChange('poster')}
        className={cn(
          segmentedButtonClassName,
          styleTheme === 'poster' && segmentedActiveClassName,
        )}
      >
        <ImageIcon data-icon='inline-start' />
      </Button>
    </div>
  );
}

function BrandTitle({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-1 items-center gap-2', className)}>
      <Image
        src='/logo.svg'
        alt='ChicPage'
        width={28}
        height={28}
        className='size-7 shrink-0 object-contain'
        priority
      />
      <div className='min-w-0'>
        <div className='truncate text-sm font-black uppercase leading-tight tracking-normal text-foreground'>
          ChicPage
        </div>
        <div className='truncate text-[10px] font-medium leading-tight text-muted-foreground'>
          移动工作台
        </div>
      </div>
    </div>
  );
}

function ThemeCard({
  theme,
  active,
  onSelect,
}: {
  theme: WechatTheme | PosterTheme;
  active: boolean;
  onSelect: () => void;
}) {
  const wechatTheme =
    'containerStyle' in theme && !('background' in theme) ? (theme as WechatTheme) : null;
  const posterTheme = 'background' in theme ? (theme as PosterTheme) : null;
  const wechatBackground = wechatTheme ? getThemeBackgroundStyle(wechatTheme) : null;
  const wechatTextureLayer = wechatTheme ? getThemeTextureLayer(wechatTheme) : null;
  const previewStyle = posterTheme
    ? {
        backgroundColor: posterTheme.background,
        backgroundImage: posterTheme.backgroundImage,
        backgroundRepeat: posterTheme.backgroundRepeat,
        backgroundSize: posterTheme.backgroundSize,
        backgroundPosition: posterTheme.backgroundPosition,
      }
    : {
        backgroundColor: wechatBackground?.backgroundColor ?? '#fff',
      };

  return (
    <button
      type='button'
      onClick={onSelect}
      className={cn(
        'group relative flex min-w-0 flex-col items-center rounded-2xl border p-1.5 text-center transition-all duration-200',
        active
          ? 'scale-[1.02] border-border bg-background text-foreground shadow-md ring-2 ring-ring/15'
          : 'border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/70 hover:text-foreground',
      )}
    >
      <span
        className={cn(
          'relative mb-1.5 aspect-[0.78/1] w-full overflow-hidden rounded-xl border transition-all',
          active ? 'border-border shadow-sm' : 'border-border/80',
        )}
        style={previewStyle}
      >
        {wechatTextureLayer ? (
          <span
            aria-hidden='true'
            className='absolute inset-0'
            style={{
              backgroundImage: `url("${wechatTextureLayer.src}")`,
              backgroundPosition: 'center top',
              backgroundRepeat: wechatTheme?.id === 'linedpaper2' ? 'repeat' : 'no-repeat',
              backgroundSize: 'cover',
              opacity: wechatTextureLayer.opacity,
            }}
          />
        ) : null}
        <span className='absolute left-2 top-2 h-1.5 w-7 rounded-full bg-foreground/15' />
        <span className='absolute left-2 top-5 h-0.5 w-8 rounded-full bg-foreground/15' />
        <span className='absolute left-2 top-7 h-0.5 w-6 rounded-full bg-foreground/10' />
        {active ? (
          <span className='absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-foreground shadow-sm'>
            <span className='size-1.5 rounded-full bg-background' />
          </span>
        ) : null}
      </span>
      <span className='w-full truncate text-[11px] font-semibold'>{theme.name}</span>
    </button>
  );
}

function ThemeDrawer({
  open,
  onOpenChange,
  styleTheme,
  wechatTheme,
  posterTheme,
  posterFont,
  onWechatThemeChange,
  onPosterThemeChange,
  onPosterFontChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styleTheme: StyleTheme;
  wechatTheme: string;
  posterTheme: string;
  posterFont: string;
  onWechatThemeChange: (theme: string) => void;
  onPosterThemeChange: (theme: string) => void;
  onPosterFontChange: (font: string) => void;
}) {
  const activeThemeId = styleTheme === 'wechat' ? wechatTheme : posterTheme;
  const themes = styleTheme === 'wechat' ? WECHAT_THEMES : POSTER_THEMES;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='max-h-[82svh] rounded-t-[28px]'>
        <DrawerHeader className='px-4 pb-3 pt-4 text-left'>
          <DrawerTitle>主题</DrawerTitle>
          <DrawerDescription>选择当前预览模式使用的视觉样式。</DrawerDescription>
        </DrawerHeader>
        <div className='min-h-0 overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
          <div className='grid grid-cols-3 gap-2'>
            {themes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                active={activeThemeId === theme.id}
                onSelect={() => {
                  if (styleTheme === 'wechat') {
                    onWechatThemeChange(theme.id);
                  } else {
                    onPosterThemeChange(theme.id);
                  }
                  onOpenChange(false);
                }}
              />
            ))}
          </div>

          {styleTheme === 'poster' ? (
            <div className='mt-4 flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-xs font-bold text-muted-foreground'>
                <Type data-icon='inline-start' />
                字体
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {POSTER_FONTS.map(font => {
                  const active = posterFont === font.id;

                  return (
                    <button
                      key={font.id}
                      type='button'
                      onClick={() => {
                        onPosterFontChange(font.id);
                        onOpenChange(false);
                      }}
                      className={cn(
                        'relative flex min-h-12 items-center justify-center rounded-2xl border px-3 py-2 text-center transition-all',
                        active
                          ? 'border-border bg-background text-foreground shadow-md ring-2 ring-ring/15'
                          : 'border-transparent bg-background text-muted-foreground hover:border-border hover:bg-muted/70 hover:text-foreground',
                      )}
                      style={{ fontFamily: font.value }}
                    >
                      <span className='line-clamp-2 text-sm font-medium leading-tight'>
                        {font.name}
                      </span>
                      {active ? (
                        <span className='absolute right-2 top-2 size-2.5 rounded-full bg-foreground' />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ExportDrawer({
  open,
  onOpenChange,
  styleTheme,
  exportStatus,
  isExportingPoster,
  exportProgress,
  onExportHtml,
  onExportMarkdown,
  onOpenPosterExportPreview,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  styleTheme: StyleTheme;
  exportStatus: 'idle' | 'success' | 'error';
  isExportingPoster: boolean;
  exportProgress?: { current: number; total: number };
  onExportHtml: () => Promise<void>;
  onExportMarkdown: () => Promise<void>;
  onOpenPosterExportPreview: () => Promise<void> | void;
}) {
  const runAndClose = async (action: () => Promise<void>) => {
    onOpenChange(false);
    await action();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='rounded-t-[28px]'>
        <DrawerHeader className='px-4 pb-3 pt-4 text-left'>
          <DrawerTitle>导出</DrawerTitle>
          <DrawerDescription>按当前预览模式选择导出方式。</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]'>
          {styleTheme === 'poster' ? (
            <Button
              type='button'
              variant='outline'
              className='h-12 justify-start rounded-2xl'
              disabled={isExportingPoster}
              onClick={() => {
                onOpenChange(false);
                void onOpenPosterExportPreview();
              }}
            >
              {isExportingPoster ? (
                <Loader2 data-icon='inline-start' className='animate-spin' />
              ) : (
                <ImageIcon data-icon='inline-start' />
              )}
              {isExportingPoster && exportProgress
                ? `导出中 ${exportProgress.current}/${exportProgress.total}`
                : '预览并导出贴图'}
            </Button>
          ) : (
            <>
              <Button
                type='button'
                variant='outline'
                className='h-12 justify-start rounded-2xl'
                onClick={() => runAndClose(onExportHtml)}
              >
                <FileCode data-icon='inline-start' />
                导出 HTML
              </Button>
              <Button
                type='button'
                variant='outline'
                className='h-12 justify-start rounded-2xl'
                onClick={() => runAndClose(onExportMarkdown)}
              >
                <Download data-icon='inline-start' />
                导出 Markdown
              </Button>
            </>
          )}

          {exportStatus !== 'idle' ? (
            <div
              className={cn(
                'rounded-2xl border px-3 py-2 text-center text-sm font-semibold',
                exportStatus === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-red-200 bg-red-50 text-red-700',
              )}
            >
              {exportStatus === 'success' ? '导出成功' : '导出失败'}
            </div>
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CopyButton({ copyStatus, onCopy }: { copyStatus: CopyStatus; onCopy: () => void }) {
  return (
    <Button
      type='button'
      variant='outline'
      size='icon-sm'
      title='复制正文'
      onClick={onCopy}
      className={cn(
        iconButtonClassName,
        copyStatus === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        copyStatus === 'error' && 'border-red-200 bg-red-50 text-red-700',
      )}
    >
      {copyStatus === 'success' ? (
        <Check data-icon='inline-start' />
      ) : (
        <Copy data-icon='inline-start' />
      )}
    </Button>
  );
}

export function MobileTopBar({
  panel,
  styleTheme,
  wechatTheme,
  posterTheme,
  posterFont,
  showWordCount,
  copyStatus,
  exportStatus,
  isExportingPoster,
  exportProgress,
  onCopy,
  onStyleThemeChange,
  onWechatThemeChange,
  onPosterThemeChange,
  onPosterFontChange,
  onShowWordCountChange,
  onExportHtml,
  onExportMarkdown,
  onOpenPosterExportPreview,
}: MobileTopBarProps) {
  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false);
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);

  return (
    <header className='flex h-14 shrink-0 items-center border-b border-border bg-card/90 px-3 backdrop-blur-xl'>
      {panel === 'edit' ? (
        <div className='flex h-full min-w-0 flex-1 items-center gap-2'>
          <BrandTitle />

          <Button
            type='button'
            variant='outline'
            size='icon-sm'
            title='导出'
            onClick={() => setIsExportDrawerOpen(true)}
            className={iconButtonClassName}
          >
            <Download data-icon='inline-start' />
          </Button>
          <CopyButton copyStatus={copyStatus} onCopy={onCopy} />
        </div>
      ) : (
        <div className='flex h-full min-w-0 flex-1 items-center gap-2'>
          <BrandTitle className='max-w-[124px] flex-none' />
          <div className='flex min-w-0 flex-1 items-center justify-end gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            <ModeSwitch styleTheme={styleTheme} onStyleThemeChange={onStyleThemeChange} />

            <Button
              type='button'
              variant='outline'
              size='icon-sm'
              title='主题'
              onClick={() => setIsThemeDrawerOpen(true)}
              className={iconButtonClassName}
            >
              <Palette data-icon='inline-start' />
            </Button>
            <Button
              type='button'
              variant='outline'
              size='icon-sm'
              title={showWordCount ? '不在正文显示字数信息' : '在正文显示字数信息'}
              onClick={() => onShowWordCountChange(!showWordCount)}
              className={cn(iconButtonClassName, showWordCount && activeIconButtonClassName)}
            >
              <FileText data-icon='inline-start' />
            </Button>
            <Button
              type='button'
              variant='outline'
              size='icon-sm'
              title='导出'
              onClick={() => setIsExportDrawerOpen(true)}
              className={iconButtonClassName}
            >
              <Download data-icon='inline-start' />
            </Button>
            <CopyButton copyStatus={copyStatus} onCopy={onCopy} />
          </div>
        </div>
      )}

      <ThemeDrawer
        open={isThemeDrawerOpen}
        onOpenChange={setIsThemeDrawerOpen}
        styleTheme={styleTheme}
        wechatTheme={wechatTheme}
        posterTheme={posterTheme}
        posterFont={posterFont}
        onWechatThemeChange={onWechatThemeChange}
        onPosterThemeChange={onPosterThemeChange}
        onPosterFontChange={onPosterFontChange}
      />
      <ExportDrawer
        open={isExportDrawerOpen}
        onOpenChange={setIsExportDrawerOpen}
        styleTheme={styleTheme}
        exportStatus={exportStatus}
        isExportingPoster={isExportingPoster}
        exportProgress={exportProgress}
        onExportHtml={onExportHtml}
        onExportMarkdown={onExportMarkdown}
        onOpenPosterExportPreview={onOpenPosterExportPreview}
      />
    </header>
  );
}
