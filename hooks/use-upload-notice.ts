'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type UploadNotice = {
  type: 'loading' | 'success' | 'error';
  message: string;
};

/**
 * 管理「图片上传 / 处理」过程中的提示状态：是否处理中、提示内容，以及带
 * 自动消失能力的 `showUploadNotice`。桌面端与移动端共用。
 */
export function useUploadNotice() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<UploadNotice | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showUploadNotice = useCallback(
    (type: UploadNotice['type'], message: string, duration?: number) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setUploadNotice({ type, message });

      if (duration) {
        timerRef.current = setTimeout(() => {
          setUploadNotice(current =>
            current?.type === type && current.message === message ? null : current,
          );
          timerRef.current = null;
        }, duration);
      }
    },
    [],
  );

  return { isUploading, setIsUploading, uploadNotice, showUploadNotice };
}
