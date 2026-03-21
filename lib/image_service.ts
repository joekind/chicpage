/**
 * 图像压缩与 IndexedDB 存储服务
 */

const DB_NAME = 'ChicPageDB';
const STORE_NAME = 'image_references';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('Window is undefined');
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * 将图片上传到 Cloudflare R2
 */
export async function uploadToCloud(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload/r2", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  const data = await response.json();
  return data.url;
}

/**
 * 图片压缩逻辑

 * 将图片缩放到指定宽度并降低质量
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 等比缩放
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
        
        ctx.drawImage(img, 0, 0, width, height);

        // 使用 JPEG 格式进行压缩，0.8 的质量通常能在肉眼无损的情况下显著减小体积
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * 将图片的 Markdown 引用部分存入 IndexedDB
 */
export async function saveImageRef(docId: string, references: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(references, docId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * 从 IndexedDB 读取图片的 Markdown 引用
 */
export async function getImageRef(docId: string): Promise<string> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(docId);
      request.onsuccess = () => resolve(request.result || "");
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('IndexedDB not ready yet:', err);
    return "";
  }
}

/**
 * 删除文档关联的图片数据
 */
export async function deleteImageRef(docId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(docId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
