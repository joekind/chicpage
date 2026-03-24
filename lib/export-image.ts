import { toPng, toJpeg } from "html-to-image";

export interface ExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  scale?: number;
  backgroundColor?: string;
  cropHeight?: number; // 裁剪到指定高度
  returnDataUrl?: boolean; // 返回 dataUrl 而不是下载
}

// 预加载元素内所有图片（优化版）
const preloadImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  if (images.length === 0) return;
  
  console.log(`准备导出，找到 ${images.length} 张图片`);

  // 限制并发数，避免内存占用过高
  const CONCURRENCY_LIMIT = 3;
  const imageArray = Array.from(images);
  const batches = [];
  
  for (let i = 0; i < imageArray.length; i += CONCURRENCY_LIMIT) {
    batches.push(imageArray.slice(i, i + CONCURRENCY_LIMIT));
  }
  
  for (const batch of batches) {
    await Promise.all(
      batch.map((img, idx) => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const timeout = setTimeout(() => {
            resolve();
          }, 3000); // 减少超时时间

          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };

          if (!img.src) {
            resolve();
          }
        });
      })
    );
  }
};

// html-to-image 通用配置
const getOptions = (element: HTMLElement, scale: number, backgroundColor: string) => ({
  cacheBust: true,
  pixelRatio: scale,
  backgroundColor,
  width: element.offsetWidth,
  height: element.offsetHeight,
  style: {
    transform: 'none',
    transformOrigin: 'top left',
  },
});

export const exportToImage = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<string | void> => {
  const {
    filename = `chicpage-xhs-${Date.now()}`,
    format = 'png',
    quality = 1,
    scale = 2,
    backgroundColor = '#ffffff',
    cropHeight,
    returnDataUrl = false
  } = options;

  try {
    await preloadImages(element);

    console.log('开始 html-to-image 渲染...');
    const opts = getOptions(element, scale, backgroundColor);
    const toImageFn = format === 'jpeg' ? toJpeg : toPng;
    let dataUrl = await toImageFn(element, {
      ...opts,
      quality: format === 'jpeg' ? quality : undefined,
    });

    console.log('html-to-image 渲染完成');

    // 如果指定了裁剪高度，进行裁剪
    if (cropHeight && cropHeight > 0) {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
      });

      const croppedCanvas = document.createElement('canvas');
      const targetHeight = Math.floor(cropHeight * scale);
      croppedCanvas.width = img.width;
      croppedCanvas.height = Math.min(targetHeight, img.height);

      const ctx = croppedCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        dataUrl = croppedCanvas.toDataURL(mimeType, quality);
        console.log('裁剪后尺寸:', croppedCanvas.width, 'x', croppedCanvas.height);
      }
    }

    // 如果只需要返回 dataUrl，不下载
    if (returnDataUrl) {
      return dataUrl;
    }

    console.log('生成下载链接...');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('导出完成！');
  } catch (error) {
    console.error('导出图片失败:', error);
    throw error;
  }
};

export const getImageDataUrl = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<string> => {
  const {
    format = 'png',
    quality = 1,
    scale = 2,
    backgroundColor = '#ffffff'
  } = options;

  await preloadImages(element);

  const opts = getOptions(element, scale, backgroundColor);
  const toImageFn = format === 'jpeg' ? toJpeg : toPng;
  return toImageFn(element, {
    ...opts,
    quality: format === 'jpeg' ? quality : undefined,
  });
};
