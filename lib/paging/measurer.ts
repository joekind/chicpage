/**
 * 分页高度测量工具
 */

import { POSTER_CARD } from '@/config/constants';

const PADDING_X = POSTER_CARD.PADDING_X;
const PADDING_Y = POSTER_CARD.PADDING_Y;
const CONTENT_W = POSTER_CARD.WIDTH - PADDING_X * 2;

/** 测量探针容器（全局复用） */
let probeElement: HTMLDivElement | null = null;
let probeContent: HTMLDivElement | null = null;
let styleElement: HTMLStyleElement | null = null;

/**
 * 初始化测量探针
 */
export function initProbe(themeCSS: string, fontValue?: string): void {
  if (!probeElement) {
    styleElement = document.createElement('style');
    probeElement = document.createElement('div');
    probeContent = document.createElement('div');

    probeElement.style.cssText = `
      position: fixed; top: -9999px; left: -9999px;
      width: ${CONTENT_W}px;
      visibility: hidden; pointer-events: none;
      box-sizing: border-box;
      overflow: hidden;
      padding: 0;
    `;

    probeContent.id = 'poster-content';
    probeElement.appendChild(probeContent);

    document.head.appendChild(styleElement);
    document.body.appendChild(probeElement);
  }

  // 更新样式
  if (styleElement && themeCSS) {
    // 将 #chicpage 替换为 #poster-content
    const adjustedCSS = themeCSS.replace(/#chicpage/g, '#poster-content');
    const fontFamilyRule = fontValue ? `font-family: ${fontValue} !important;` : '';
    styleElement.textContent = `
      ${adjustedCSS}
      #poster-content {
        ${fontFamilyRule}
        font-size: 14.5px;
        line-height: 1.8;
        word-wrap: break-word;
        padding: 0 !important;
        margin: 0 !important;
      }
    `;
  }
}

/**
 * 清理测量探针
 */
export function cleanupProbe(): void {
  if (probeElement && probeElement.parentNode) {
    document.body.removeChild(probeElement);
  }
  if (styleElement && styleElement.parentNode) {
    document.head.removeChild(styleElement);
  }
  probeElement = null;
  probeContent = null;
  styleElement = null;
}

/**
 * 测量节点列表的高度
 */
export async function measureHeight(
  nodes: Node[],
  waitForImage = false
): Promise<number> {
  if (!probeContent) {
    throw new Error('Probe not initialized. Call initProbe first.');
  }

  probeContent.innerHTML = '';

  // 包装节点
  const themeWrap = document.createElement('div');
  themeWrap.id = 'chicpage';
  nodes.forEach((n) => themeWrap.appendChild(n.cloneNode(true)));

  const posterWrap = document.createElement('div');
  posterWrap.id = 'poster-content';
  posterWrap.appendChild(themeWrap);

  const outerWrap = document.createElement('div');
  outerWrap.style.cssText = 'display: block; width: 100%; border: 1px solid transparent; padding: 0;';
  outerWrap.appendChild(posterWrap);

  probeContent.appendChild(outerWrap);

  if (waitForImage) {
    await waitForImages(probeContent);
  }

  const h = outerWrap.getBoundingClientRect().height;
  return h - 2; // 减去 2px 边框高度
}

/**
 * 等待元素中的图片加载
 */
function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 2000);
        }),
    ),
  ).then(() => undefined);
}
