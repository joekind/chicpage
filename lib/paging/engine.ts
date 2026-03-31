/**
 * 贴图分页引擎
 * 按语义块测量高度并分页
 */

import { POSTER_CONTENT_HEIGHT } from '@/config/constants';
import type { PagingBlockItem } from './types';
import { parseSections, nodesToHtml, hasImage, preloadImages } from './utils';
import { initProbe, cleanupProbe, measureHeight } from './measurer';
import { sliceBlock } from './slicer';

/**
 * 计算分页
 */
export async function calculateSlides(
  html: string,
  themeCSS: string,
  fontValue?: string
): Promise<PagingBlockItem[]> {
  // 初始化测量探针
  initProbe(themeCSS, fontValue);

  try {
    // 1. 解析章节
    const sections = parseSections(html);
    if (sections.length === 0) return [];

    // 2. 预加载图片
    const sourceImages = Array.from(
      document.querySelectorAll('img')
    ).map((img) => img.getAttribute('src')).filter((src): src is string => Boolean(src));

    await preloadImages(sourceImages);

    // 3. 按页装箱
    const finalSlides: PagingBlockItem[] = [];
    const contentH = POSTER_CONTENT_HEIGHT;

    for (let sectionId = 0; sectionId < sections.length; sectionId++) {
      const blockQueue = [...sections[sectionId]];
      const pagesInSection: string[] = [];
      let currentPageBlocks: Node[] = [];

      while (blockQueue.length > 0) {
        const block = blockQueue.shift()!;

        // 测量当前页面高度
        const beforeH =
          currentPageBlocks.length > 0
            ? await measureHeight(currentPageBlocks, false)
            : 0;

        const candidate = [...currentPageBlocks, block];
        const candH = await measureHeight(candidate, hasImage(block));

        if (candH <= contentH) {
          currentPageBlocks = candidate;
          continue;
        }

        // 不适合当前页，尝试切块
        const remainingH = contentH - beforeH;
        if (remainingH > 80) {
          const sliced = await sliceBlock(block, remainingH);
          if (sliced) {
            currentPageBlocks.push(sliced.first);
            pagesInSection.push(nodesToHtml(currentPageBlocks));
            currentPageBlocks = [];
            blockQueue.unshift(...sliced.rest);
            continue;
          }
        }

        // 必须换页
        if (currentPageBlocks.length > 0) {
          pagesInSection.push(nodesToHtml(currentPageBlocks));
          currentPageBlocks = [];
        }

        // 检查块是否单独占满一页
        const soloH = await measureHeight([block], hasImage(block));
        if (soloH <= contentH) {
          currentPageBlocks = [block];
        } else {
          // 尝试切分到下一页
          const sliced = await sliceBlock(block, contentH);
          if (sliced) {
            currentPageBlocks = [sliced.first];
            blockQueue.unshift(...sliced.rest);
          } else {
            // 无法切分（如图片），单独成页
            pagesInSection.push(nodesToHtml([block]));
          }
        }
      }

      if (currentPageBlocks.length > 0) {
        pagesInSection.push(nodesToHtml(currentPageBlocks));
      }

      // 生成最终幻灯片
      const totalInGroup = pagesInSection.length || 1;
      pagesInSection.forEach((pageHtml, pageInGroup) => {
        finalSlides.push({
          html: pageHtml,
          sectionId,
          pageInGroup,
          totalInGroup,
        });
      });
    }

    return finalSlides;
  } finally {
    // 清理测量探针
    cleanupProbe();
  }
}
