'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { PosterLayoutConfig } from '@/components/workspace/preview/xhs-slide-preview';
import type { PosterTheme } from '@/lib/themes';

interface MobileExportPreviewProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  slides: {
    html: string;
    index: number;
    totalInGroup: number;
    pageInGroup: number;
  }[];
  theme: PosterTheme;
  themeCSS: string;
  layout: PosterLayoutConfig;
  isSubmitting: boolean;
  exportProgress?: { current: number; total: number };
}

export function MobileExportPreview({
  containerRef,
  isOpen,
  onClose,
  onConfirm,
  slides,
  theme,
  themeCSS,
  layout,
  isSubmitting,
  exportProgress,
}: MobileExportPreviewProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);
  const enlargedDialogRef = useRef<HTMLDivElement>(null);
  const scopedCSS = useMemo(
    () => themeCSS.replace(/#xhs-content/g, '.preview-content'),
    [themeCSS],
  );
  const activeSlide = activeSlideIndex !== null ? slides[activeSlideIndex] : undefined;
  const activePreviewScale = Math.min(0.82, 300 / layout.width, 420 / layout.height);

  // 放大预览是叠加在 Drawer 之上的临时弹层：用捕获阶段拦截 Esc，避免冒泡到
  // vaul 把整个抽屉一起关掉；打开时把焦点移到弹层容器，保证键盘可达。
  useEffect(() => {
    if (activeSlideIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setActiveSlideIndex(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    enlargedDialogRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [activeSlideIndex]);

  const handleClose = () => {
    setActiveSlideIndex(null);
    onClose();
  };

  const renderSlideCard = (
    slide: MobileExportPreviewProps['slides'][number],
    scale: number,
    exportClassName = '',
  ) => {
    const width = Math.round(layout.width * scale);
    const height = Math.round(layout.height * scale);

    return (
      <div
        className='relative overflow-hidden'
        style={{
          width,
          height,
        }}
      >
        <div
          className={exportClassName}
          style={{
            width: layout.width,
            height: layout.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundColor: theme.background,
            backgroundImage: theme.backgroundImage,
            backgroundRepeat: theme.backgroundRepeat,
            backgroundSize: theme.backgroundSize,
            backgroundPosition: theme.backgroundPosition,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ height: layout.statusHeight, flexShrink: 0 }} />
          <div
            style={{
              width: '100%',
              height: `calc(100% - ${layout.statusHeight}px - ${layout.footerHeight}px)`,
              padding: `${layout.paddingY}px ${layout.paddingX}px`,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <div
              className='preview-content w-full'
              style={{
                height: layout.contentHeight,
                overflow: 'hidden',
              }}
            >
              <div id='chicpage' dangerouslySetInnerHTML={{ __html: slide.html }} />
            </div>
          </div>
          <div style={{ height: layout.footerHeight, flexShrink: 0 }} />
        </div>
      </div>
    );
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={nextOpen => {
        if (!nextOpen) handleClose();
      }}
    >
      <DrawerContent className='h-[92svh] max-h-190 overflow-hidden rounded-t-[28px] tracking-normal data-[vaul-drawer-direction=bottom]:max-h-[92svh]'>
        <style>{scopedCSS}</style>

        <div
          ref={containerRef}
          className='pointer-events-none fixed -left-[9999px] top-0'
          aria-hidden='true'
        >
          {slides.map(slide => (
            <div key={`export-${slide.index}`} className='mb-6'>
              {renderSlideCard(slide, 1, 'mobile-xhs-export-page')}
            </div>
          ))}
        </div>

        <DrawerHeader className='shrink-0 px-4 pb-3 pt-4 text-left'>
          <DrawerTitle>导出预览</DrawerTitle>
          <DrawerDescription>共 {slides.length} 页，确认后导出为 PNG 图片。</DrawerDescription>
        </DrawerHeader>

        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4'>
          {slides.length === 0 ? (
            <div className='rounded-2xl border border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground'>
              暂无可导出的贴图页面
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-3'>
              {slides.map((slide, index) => (
                <button
                  key={slide.index}
                  type='button'
                  className='relative overflow-hidden rounded-2xl border border-border bg-background p-2 text-left shadow-sm'
                  onClick={() => setActiveSlideIndex(index)}
                >
                  <div className='absolute left-3 top-3 z-10 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-bold text-white'>
                    第 {slide.index + 1} 页
                  </div>
                  <div className='flex justify-center pt-6'>{renderSlideCard(slide, 0.42)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='flex shrink-0 items-center gap-2 border-t border-border bg-card/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl'>
          <Button
            variant='outline'
            className='h-11 flex-1 rounded-2xl'
            onClick={handleClose}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            className='h-11 flex-1 rounded-2xl'
            onClick={onConfirm}
            disabled={isSubmitting || slides.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 data-icon='inline-start' className='animate-spin' />
                {exportProgress ? `${exportProgress.current}/${exportProgress.total}` : '导出中'}
              </>
            ) : (
              `导出 ${slides.length} 张 PNG`
            )}
          </Button>
        </div>

        {activeSlide ? (
          <div
            className='fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-5'
            role='presentation'
            onClick={() => setActiveSlideIndex(null)}
          >
            <div
              ref={enlargedDialogRef}
              role='dialog'
              aria-modal='true'
              aria-label={`第 ${activeSlide.index + 1} 页放大预览`}
              tabIndex={-1}
              className='relative my-auto max-w-full rounded-2xl bg-card p-3 shadow-2xl outline-none'
              onClick={event => event.stopPropagation()}
            >
              <Button
                type='button'
                variant='outline'
                size='icon-sm'
                className='absolute -right-2 -top-2 rounded-full bg-card'
                aria-label='关闭放大预览'
                onClick={() => setActiveSlideIndex(null)}
              >
                <X data-icon='inline-start' />
              </Button>
              <div className='mb-2 text-center text-xs font-semibold text-muted-foreground'>
                第 {activeSlide.index + 1} 页
              </div>
              {renderSlideCard(activeSlide, activePreviewScale)}
              <div className='mt-3 flex items-center justify-center gap-3'>
                <Button
                  variant='outline'
                  size='icon-sm'
                  className='rounded-xl'
                  disabled={activeSlideIndex === 0}
                  onClick={() =>
                    setActiveSlideIndex(current =>
                      current === null ? current : Math.max(0, current - 1),
                    )
                  }
                >
                  <ChevronLeft data-icon='inline-start' />
                </Button>
                <Button
                  variant='outline'
                  size='icon-sm'
                  className='rounded-xl'
                  disabled={activeSlideIndex === slides.length - 1}
                  onClick={() =>
                    setActiveSlideIndex(current =>
                      current === null ? current : Math.min(slides.length - 1, current + 1),
                    )
                  }
                >
                  <ChevronRight data-icon='inline-start' />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
