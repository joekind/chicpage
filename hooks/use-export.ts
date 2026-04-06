/**
 * 导出功能 Hook
 * 处理贴图导出为图片的逻辑
 */

import { useState, useCallback } from 'react';
import { exportToImage } from '@/lib/export-image';
import { getXHSTheme } from '@/lib/xhs-themes';
import { XHS_FONTS } from '@/lib/fonts';
import JSZip from 'jszip';
import type { SlidePreviewMethods, ExportProgress } from '@/types';

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | undefined>(undefined);

  /**
   * 确认并执行导出
   */
  const confirmExport = useCallback(async (
    slideRef: React.RefObject<SlidePreviewMethods | null>,
    themeId: string,
    fontId: string
  ) => {
    if (!slideRef.current) return;

    setIsExporting(true);
    setExportProgress({ current: 0, total: 0 });

    try {
      const totalSlides = slideRef.current.getSlidesCount();
      setExportProgress({ current: 0, total: totalSlides });

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5);

      const slidePages = Array.from(
        document.querySelectorAll('.poster-slide-page'),
      ) as HTMLElement[];

      if (slidePages.length < totalSlides) {
        throw new Error(
          `导出失败：页面节点不足（${slidePages.length}/${totalSlides}）`,
        );
      }

      const theme = getXHSTheme(themeId);
      const validResults: { filename: string; dataUrl: string; base64Data: string }[] = [];

      for (let i = 0; i < totalSlides; i++) {
        const slidePage = slidePages[i];
        const dataUrl = (await exportToImage(slidePage as HTMLElement, {
          filename: `chicpage-${timestamp}-${i + 1}-of-${totalSlides}`,
          format: 'png',
          scale: 3, // EXPORT.DEFAULT_SCALE
          backgroundColor: theme.background,
          returnDataUrl: true,
        })) as string;

        if (dataUrl) {
          const filename = `chicpage-${timestamp}-${i + 1}-of-${totalSlides}.png`;
          validResults.push({
            filename,
            dataUrl,
            base64Data: dataUrl.split(',')[1],
          });
        }
        setExportProgress({ current: i + 1, total: totalSlides });
      }

      // 打包为 ZIP
      const zip = new JSZip();
      validResults.forEach((result) => {
        zip.file(result.filename, result.base64Data, { base64: true });
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `chicpage-${timestamp}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
      setExportProgress(undefined);
    }
  }, []);

  return {
    isExporting,
    exportProgress,
    confirmExport,
    setIsExporting,
  };
}
