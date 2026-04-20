/**
 * 背景图片 Base64 数据
 * 用于公众号复制时内联背景图片
 */

// 这个文件会在构建时自动生成 base64 数据
// 如果图片更新，需要重新生成

export const BACKGROUND_BASE64: Record<string, string> = {
  'lined-paper-2': '', // 将在运行时动态加载
  'egg-shell': '',
  'concrete-wall': '',
};

/**
 * 将背景图片 URL 转换为 base64
 */
export async function convertBackgroundToBase64(url: string): Promise<string | null> {
  if (!url || typeof window === 'undefined') return null;
  
  // 如果已经是 base64，直接返回
  if (url.startsWith('data:image')) return url;
  
  // 如果是 blob URL，直接返回（本地图片）
  if (url.startsWith('blob:')) return url;
  
  try {
    // 转换为绝对路径
    const absoluteUrl = new URL(url, window.location.origin).toString();
    
    // 获取图片
    const response = await fetch(absoluteUrl);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    
    // 转换为 base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert background to base64:', error);
    return null;
  }
}

/**
 * 检查背景图片大小是否适合转为 base64
 * 建议小于 100KB
 */
export async function isBackgroundSizeAcceptable(url: string): Promise<boolean> {
  if (!url || typeof window === 'undefined') return false;
  
  try {
    const absoluteUrl = new URL(url, window.location.origin).toString();
    const response = await fetch(absoluteUrl, { method: 'HEAD' });
    const size = parseInt(response.headers.get('content-length') || '0', 10);
    
    // 小于 100KB 认为可接受
    return size < 100 * 1024;
  } catch {
    return false;
  }
}
