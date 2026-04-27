/**
 * 图像压缩与 IndexedDB 本地存储服务
 */

const DB_NAME = 'ChicPageDB';
const STORE_NAME = 'images'; // 存储实际图片数据
const DB_VERSION = 2; // 如果之前已经是 2，可以保持或升级

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
 * 将图片存储到本地 IndexedDB
 */
export async function storeImageLocally(file: File): Promise<string> {
  const compressedBase64 = await compressImage(file);
  const id = `img-${Math.random().toString(36).substr(2, 9)}`;
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(compressedBase64, id);
    request.onsuccess = () => resolve(`img://${id}`);
    request.onerror = () => reject(request.error);
  });
}

/**
 * 从 IndexedDB 获取图片数据
 */
export async function getLocalImage(id: string): Promise<string | null> {
  const db = await openDB();
  const cleanId = id.replace('img://', '');
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(cleanId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * 图片压缩逻辑
 * 将图片缩放到最大 1920px 并使用 85% 质量
 */
export async function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<string> {
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

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Failed to get canvas context');
        
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * 删除文件关联的所有本地图片
 */
export async function deleteLocalImages(ids: string[]): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  ids.forEach(id => store.delete(id.replace('img://', '')));
}
