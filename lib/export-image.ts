import html2canvas from "html2canvas";

export interface ExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  scale?: number;
  backgroundColor?: string;
  cropHeight?: number; // 裁剪到指定高度
}

export const exportToImage = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = `chicpage-xhs-${Date.now()}`,
    format = 'png',
    quality = 1,
    scale = 2,
    backgroundColor = '#ffffff',
    cropHeight
  } = options;

  try {
    // 预加载所有图片
    const images = element.querySelectorAll('img');
    console.log(`准备导出，找到 ${images.length} 张图片`);
    
    await Promise.all(
      Array.from(images).map((img, idx) => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            console.log(`图片 ${idx + 1} 已加载`);
            resolve();
            return;
          }
          const timeout = setTimeout(() => {
            console.warn(`图片 ${idx + 1} 加载超时`);
            resolve();
          }, 5000);
          
          img.onload = () => {
            clearTimeout(timeout);
            console.log(`图片 ${idx + 1} 加载完成`);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            console.warn(`图片 ${idx + 1} 加载失败`);
            resolve();
          };
          
          // 如果图片还没开始加载，触发加载
          if (!img.src) {
            console.warn(`图片 ${idx + 1} 没有 src`);
            resolve();
          }
        });
      })
    );

    console.log('开始 html2canvas 渲染...');
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor,
      useCORS: true, // 启用 CORS 以允许跨域图片下载并避免污染 canvas
      allowTaint: false, // 禁止污染，否则无法导出（toDataURL 报错）
      logging: true, // 开启日志便于调试
      imageTimeout: 0, // 禁用超时，因为图片已预加载
      windowHeight: element.scrollHeight + 100, // 增加窗口高度确保内容完整
      onclone: (clonedDoc) => {
        console.log('html2canvas 克隆文档');
        // 确保克隆文档中的图片路径正确
        const clonedImages = clonedDoc.querySelectorAll('img');
        clonedImages.forEach((img, idx) => {
          // 如果是相对路径，转换为绝对路径
          if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('http')) {
            const absoluteUrl = new URL(img.src, window.location.href).href;
            img.src = absoluteUrl;
            console.log(`图片 ${idx + 1} 转为绝对路径:`, absoluteUrl);
          }
        });
      }
    });

    console.log('html2canvas 渲染完成，canvas 尺寸:', canvas.width, 'x', canvas.height);
    
    // 如果指定了裁剪高度，进行裁剪
    let finalCanvas = canvas;
    if (cropHeight && cropHeight > 0) {
      const croppedCanvas = document.createElement('canvas');
      const targetHeight = Math.floor(cropHeight * scale);
      croppedCanvas.width = canvas.width;
      croppedCanvas.height = Math.min(targetHeight, canvas.height);
      
      const ctx = croppedCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, 0, 0);
        finalCanvas = croppedCanvas;
        console.log('裁剪后尺寸:', finalCanvas.width, 'x', finalCanvas.height);
      }
    }
    
    console.log('生成下载链接...');
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = finalCanvas.toDataURL(mimeType, quality);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('导出完成！');
    return Promise.resolve();
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

  // 预加载所有图片
  const images = element.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }
        img.onload = () => resolve();
        img.onerror = () => resolve();
        if (!img.src) resolve();
      });
    })
  );

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      const clonedImages = clonedDoc.querySelectorAll('img');
      clonedImages.forEach((img) => {
        img.crossOrigin = 'anonymous';
        if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('http')) {
          img.src = new URL(img.src, window.location.href).href;
        }
      });
    }
  });

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  return canvas.toDataURL(mimeType, quality);
};
