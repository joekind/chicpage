'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  XHSSlidePreview,
  type PosterLayoutConfig,
  type XHSSlidePreviewMethods,
} from '@/components/workspace/preview/xhs-slide-preview';
import { PreviewContent } from '@/components/workspace/preview/preview-content';
import type { StyleTheme } from '@/lib/editor/commands';
import type { PosterTheme, WechatTheme } from '@/lib/themes';
import { cn } from '@/lib/utils';
import type { PosterRatio } from '@/types';

const POSTER_RATIO_OPTIONS: PosterRatio[] = ['3:4', '9:16', '1:1'];
const MAX_MOBILE_POSTER_PREVIEW_SCALE = 1.18;
const POSTER_SCALE_EPSILON = 0.001;

interface MobilePreviewPaneProps {
  html: string;
  styleTheme: StyleTheme;
  imgRadius: number;
  activeTheme: WechatTheme;
  activeThemeCss: string;
  activePosterTheme: PosterTheme;
  posterFont: string;
  posterRatio: PosterRatio;
  posterShowHeader: boolean;
  posterShowFooter: boolean;
  posterLayout: PosterLayoutConfig;
  wordCount: number;
  readTime: number;
  previewRef: React.RefObject<HTMLDivElement | null>;
  posterSlideRef: React.RefObject<XHSSlidePreviewMethods | null>;
  onPosterRatioChange: (ratio: PosterRatio) => void;
  onImageWidthChange?: (imageIndex: number, widthPercent: number) => void;
}

export function MobilePreviewPane({
  html,
  styleTheme,
  imgRadius,
  activeTheme,
  activeThemeCss,
  activePosterTheme,
  posterFont,
  posterRatio,
  posterShowHeader,
  posterShowFooter,
  posterLayout,
  wordCount,
  readTime,
  previewRef,
  posterSlideRef,
  onPosterRatioChange,
  onImageWidthChange,
}: MobilePreviewPaneProps) {
  const posterFrameRef = useRef<HTMLDivElement>(null);
  const [posterScale, setPosterScale] = useState(1);

  useEffect(() => {
    const node = posterFrameRef.current;
    if (!node) return;

    const updateScale = () => {
      const availableWidth = Math.max(280, node.getBoundingClientRect().width - 8);
      const widthScale = Math.min(
        MAX_MOBILE_POSTER_PREVIEW_SCALE,
        availableWidth / posterLayout.width,
      );
      const availableHeight = Math.max(0, node.clientHeight - 16);
      const heightOverflow = posterLayout.height * widthScale - availableHeight;
      const nextScale =
        heightOverflow > 0 && heightOverflow < 48
          ? availableHeight / posterLayout.height
          : widthScale;

      setPosterScale(currentScale =>
        Math.abs(currentScale - nextScale) < POSTER_SCALE_EPSILON ? currentScale : nextScale,
      );
    };
    const resizeObserver = new ResizeObserver(updateScale);

    updateScale();
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, [posterLayout.height, posterLayout.width, styleTheme]);

  if (styleTheme === 'poster') {
    return (
      <div className='flex h-full min-w-0 flex-col overflow-hidden bg-background'>
        <div
          ref={posterFrameRef}
          className='flex min-w-0 flex-1 items-start justify-center overflow-x-hidden overflow-y-auto px-1.5 py-2'
        >
          <div
            className='relative max-w-full overflow-hidden'
            style={{
              width: posterLayout.width * posterScale,
              minHeight: posterLayout.height * posterScale,
            }}
          >
            <div
              style={{
                width: posterLayout.width,
                transform: `scale(${posterScale})`,
                transformOrigin: 'top left',
              }}
            >
              <XHSSlidePreview
                ref={posterSlideRef}
                html={html}
                theme={activePosterTheme}
                font={posterFont}
                ratio={posterRatio}
                showHeader={posterShowHeader}
                showFooter={posterShowFooter}
                hideMockUI
                onImageWidthChange={onImageWidthChange}
              />
            </div>
          </div>
        </div>

        <div className='flex h-[61px] shrink-0 items-center justify-center gap-3 border-t border-border bg-card/90 px-3 backdrop-blur-xl'>
          <Button
            variant='outline'
            size='icon-sm'
            title='上一张'
            onClick={() => posterSlideRef.current?.goPrev()}
            className='rounded-xl'
          >
            <ChevronLeft data-icon='inline-start' />
          </Button>
          <div className='flex min-w-0 flex-1 items-center justify-center gap-2'>
            <div className='flex h-9 shrink-0 items-center rounded-xl border border-border bg-muted p-0.5'>
              {POSTER_RATIO_OPTIONS.map(ratio => (
                <Button
                  key={ratio}
                  type='button'
                  variant='ghost'
                  size='sm'
                  title={`切换为 ${ratio}`}
                  onClick={() => onPosterRatioChange(ratio)}
                  className={cn(
                    'h-8 rounded-lg px-2.5 text-xs font-bold text-muted-foreground hover:bg-background hover:text-foreground',
                    posterRatio === ratio &&
                      'border border-border bg-background text-foreground shadow-sm',
                  )}
                >
                  {ratio}
                </Button>
              ))}
            </div>
          </div>
          <Button
            variant='outline'
            size='icon-sm'
            title='下一张'
            onClick={() => posterSlideRef.current?.goNext()}
            className='rounded-xl'
          >
            <ChevronRight data-icon='inline-start' />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-full min-w-0 flex-col overflow-hidden bg-background'>
      <div className='min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4'>
        <div className='mx-auto min-h-full w-full max-w-[430px] overflow-hidden rounded-[24px] bg-card/70 px-3 py-4 shadow-sm ring-1 ring-border/70 backdrop-blur-sm'>
          <PreviewContent
            containerRef={previewRef}
            html={html}
            styleTheme={styleTheme}
            imgRadius={imgRadius}
            activeThemeCss={activeThemeCss}
            activeTheme={activeTheme}
            onImageWidthChange={onImageWidthChange}
          />
        </div>
      </div>
      <div className='flex h-[61px] shrink-0 items-center justify-center border-t border-border bg-card/90 px-3 text-[11px] font-medium text-muted-foreground backdrop-blur-xl'>
        <div className='flex min-w-0 items-center gap-3'>
          <span className='shrink-0'>全文 {wordCount} 字</span>
          <span className='shrink-0'>预计阅读 {readTime} 分钟</span>
        </div>
      </div>
    </div>
  );
}
