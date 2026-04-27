/**
 * ChicPage Inline Style Engine for WeChat
 * Reads computed styles from the live DOM and inlines them onto a clone,
 * with special handling for WeChat's limited HTML support.
 */

// Properties that WeChat supports and we should preserve
const STYLE_PROPERTIES = [
  // Text
  'color', 'fontSize', 'fontWeight', 'fontFamily', 'fontStyle',
  'lineHeight', 'letterSpacing', 'textAlign', 'textDecoration',
  'textIndent', 'whiteSpace', 'wordBreak', 'overflowWrap',
  // Box model
  'display', 'boxSizing',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'maxWidth',
  // Visual
  'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundRepeat', 'backgroundPosition',
  'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
  'borderRadius', 'borderCollapse',
  'boxShadow', 'opacity',
  // List
  'listStyleType', 'listStylePosition',
  // Table
  'verticalAlign',
] as const;

/**
 * Applies WeChat-specific optimizations to an element
 */
function applyWeChatOptimizations(elem: HTMLElement, imgRadius: number = 8): void {
  const tag = elem.tagName;

  // 图片优化 - 确保图片在微信中正常显示
  if (tag === 'IMG') {
    const src = elem.getAttribute('src') || '';
    const isBase64 = src.startsWith('data:image');

    // 基础样式
    elem.style.maxWidth = '100%';
    elem.style.height = 'auto';
    elem.style.display = 'block';
    elem.style.margin = '1.5em auto';
    elem.style.borderRadius = `${imgRadius}px`; // 使用用户配置的圆角

    // 移除可能干扰的样式
    elem.style.border = 'none';
    elem.style.outline = 'none';

    // 如果是 base64 图片，添加特殊处理
    if (isBase64) {
      elem.style.verticalAlign = 'middle';
    }
    
    // 添加暗黑模式适配
    elem.setAttribute('data-darkmode-bgcolor', 'transparent');
    elem.setAttribute('data-darkmode-original-bgcolor', 'transparent');
  }

  // 代码块优化 - 微信对 pre/code 的支持非常有限
  if (tag === 'PRE') {
    elem.style.margin = '1.5em 0';
    elem.style.padding = '1em';
    elem.style.backgroundColor = '#f8fafc';
    elem.style.border = '1px solid #e2e8f0';
    elem.style.borderRadius = '8px';
    // 公众号端不支持真正折叠，这里用固定高度 + 滚动模拟“可收纳”
    elem.style.maxHeight = '360px';
    elem.style.overflowX = 'auto';
    elem.style.overflowY = 'auto';
    elem.style.lineHeight = '1.6';
    elem.style.fontSize = '14px';
    elem.style.color = '#334155';
    
    // 添加暗黑模式适配属性
    elem.setAttribute('data-darkmode-bgcolor', '#f8fafc');
    elem.setAttribute('data-darkmode-original-bgcolor', '#f8fafc');
    elem.setAttribute('data-darkmode-color', '#334155');
    elem.setAttribute('data-darkmode-original-color', '#334155');
  }

  if (tag === 'CODE') {
    // 区分行内代码和块代码
    const isInline = !elem.parentElement || elem.parentElement.tagName !== 'PRE';
    
    if (isInline) {
      elem.style.backgroundColor = '#f6f8fa';
      elem.style.color = '#e06c75';
      elem.style.padding = '0.2em 0.4em';
      elem.style.borderRadius = '3px';
      elem.style.fontSize = '85%';
      elem.style.fontFamily = 'Consolas, Monaco, monospace';
      
      // 行内代码暗黑模式适配
      elem.setAttribute('data-darkmode-bgcolor', '#2d2d2d');
      elem.setAttribute('data-darkmode-original-bgcolor', '#2d2d2d');
      elem.setAttribute('data-darkmode-color', '#e06c75');
      elem.setAttribute('data-darkmode-original-color', '#e06c75');
    } else {
      elem.style.fontFamily = 'Consolas, Monaco, monospace';
      elem.style.display = 'block';
      elem.style.whiteSpace = 'pre';
      elem.style.wordBreak = 'normal';
      elem.style.wordSpacing = 'normal';
      elem.style.color = 'inherit';
    }
  }

  // 引用块优化 - 只处理间距，颜色由主题 CSS 决定
  if (tag === 'BLOCKQUOTE') {
    elem.style.padding = '0.9em 1.1em';
    elem.style.margin = '1.2em 0';
    elem.style.fontSize = '0.95em';
    elem.style.borderRadius = '12px';
    elem.style.borderLeft = 'none';
    elem.style.borderTop = 'none';
    elem.style.borderRight = 'none';
    elem.style.borderBottom = 'none';
    elem.style.backgroundColor = '#f8fafc';
    
    // 添加暗黑模式适配
    const bgColor = window.getComputedStyle(elem).backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      elem.setAttribute('data-darkmode-bgcolor', bgColor);
      elem.setAttribute('data-darkmode-original-bgcolor', bgColor);
    }
    
    const innerPs = elem.querySelectorAll('p');
    innerPs.forEach(p => {
      (p as HTMLElement).style.margin = '0.5em 0';
    });
  }

  // 列表优化 - 颜色由主题决定，这里只处理间距
  if (tag === 'UL' || tag === 'OL') {
    elem.style.paddingLeft = '2em';
    elem.style.margin = '1.2em 0';
  }

  if (tag === 'LI') {
    elem.style.margin = '0.4em 0';
    elem.style.lineHeight = '1.75';
    elem.style.listStylePosition = 'outside';
  }

  // 标题优化 - 只处理间距，颜色由主题 CSS 决定
  if (tag.startsWith('H')) {
    elem.style.margin = '1.8em 0 0.8em';
    elem.style.fontWeight = 'bold';
    elem.style.lineHeight = '1.3';
  }

  // 段落优化 - 颜色由主题决定
  if (tag === 'P') {
    elem.style.margin = '1.2em 0';
    elem.style.lineHeight = '1.75';
    elem.style.textAlign = 'justify';
  }

  // 链接优化
  if (tag === 'A') {
    elem.style.color = '#2563eb';
    elem.style.textDecoration = 'underline';
    elem.style.wordBreak = 'break-all';
  }

  // 分割线优化
  if (tag === 'HR') {
    elem.style.border = 'none';
    elem.style.height = '1px';
    elem.style.backgroundColor = '#dde1e6';
    elem.style.margin = '2em 0';
  }

  // 表格优化
  if (tag === 'TABLE') {
    elem.style.width = '100%';
    elem.style.borderCollapse = 'collapse';
    elem.style.margin = '1.5em 0';
    elem.style.fontSize = '14px';
    elem.style.border = '1px solid #e5e7eb';
  }

  if (tag === 'TH') {
    elem.style.backgroundColor = '#f9fafb';
    elem.style.padding = '10px 12px';
    elem.style.border = '1px solid #e5e7eb';
    elem.style.fontWeight = 'bold';
    elem.style.textAlign = 'left';
  }

  if (tag === 'TD') {
    elem.style.padding = '10px 12px';
    elem.style.border = '1px solid #e5e7eb';
    elem.style.color = '#4b5563';
  }
}

/**
 * Traverses a DOM tree, reads computed styles, and inlines them onto a clone.
 * Returns the innerHTML of the cloned element — ready to paste into WeChat.
 *
 * @param sourceElem - The source element to clone
 * @param options - Optional configuration
 */
export function getInlinedHtml(
  sourceElem: HTMLElement,
  options: { wechatOptimized?: boolean; imgRadius?: number } = {}
): string {
  const { wechatOptimized = true, imgRadius = 8 } = options;

  const clone = sourceElem.cloneNode(true) as HTMLElement;

  const sourceNodes = [sourceElem, ...Array.from(sourceElem.querySelectorAll('*'))];
  const cloneNodes  = [clone,      ...Array.from(clone.querySelectorAll('*'))];

  for (let i = 0; i < sourceNodes.length; i++) {
    const s = sourceNodes[i] as HTMLElement;
    const c = cloneNodes[i]  as HTMLElement;
    if (!s || !c) continue;

    // Drop script/style nodes entirely
    if (s.tagName === 'STYLE' || s.tagName === 'SCRIPT') {
      c.remove();
      continue;
    }

    const computed = window.getComputedStyle(s);

    if (wechatOptimized) {
      // 应用微信优化
      applyWeChatOptimizations(c, imgRadius);

      // 内联基本样式
      STYLE_PROPERTIES.forEach(prop => {
        const value = computed[prop];
        if (value && value !== 'initial' && value !== 'none' && value !== 'normal') {
          c.style[prop] = value;
        }
      });
    } else {
      // 原始逻辑
      STYLE_PROPERTIES.forEach(prop => {
        const value = computed[prop];
        if (value && value !== 'initial' && value !== 'none' && value !== 'normal') {
          c.style[prop] = value;
        }
      });
    }
  }

  // 包装一层，确保样式应用
  const wrapper = document.createElement('div');
  wrapper.style.fontFamily = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
  wrapper.style.fontSize = '15px';
  wrapper.style.color = '#333';
  wrapper.style.lineHeight = '1.8';
  wrapper.appendChild(clone);

  return wrapper.innerHTML;
}

/**
 * 优化 base64 图片数据，确保在微信中正常显示
 */
function optimizeBase64Images(html: string): string {
  // 使用 DOMParser 替代正则表达式，避免 HTML 解析错误
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 处理所有 img 标签
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    const currentStyle = img.getAttribute('style') || '';
    const styles = currentStyle.split(';').map((s: string) => s.trim()).filter(Boolean);

    // 检查是否已包含关键样式
    const hasMaxWidth = styles.some((s: string) => s.startsWith('max-width'));
    const hasHeight = styles.some((s: string) => s.startsWith('height'));
    const hasDisplay = styles.some((s: string) => s.startsWith('display'));

    // 添加缺失的关键样式
    if (!hasMaxWidth) styles.push('max-width:100%');
    if (!hasHeight) styles.push('height:auto');
    if (!hasDisplay) styles.push('display:block');

    img.setAttribute('style', styles.join(';'));
  });

  return doc.body.innerHTML;
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Failed to read blob as data URL'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(rawUrl: string): Promise<string | null> {
  if (typeof window === 'undefined' || !rawUrl) return null;
  if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) return rawUrl;

  try {
    const absoluteUrl = new URL(rawUrl, window.location.origin).toString();
    const response = await fetch(absoluteUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch {
    return null;
  }
}

async function inlineStyleUrls(style: string): Promise<string> {
  if (typeof window === 'undefined' || !style.includes('url(')) {
    return style;
  }

  const matches = Array.from(style.matchAll(/url\((['"]?)(.*?)\1\)/gi));
  if (matches.length === 0) return style;

  let nextStyle = style;

  for (const match of matches) {
    const rawUrl = match[2]?.trim();
    if (!rawUrl || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
      continue;
    }

    try {
      const dataUrl = await fetchAsDataUrl(rawUrl);
      if (!dataUrl) {
        // 如果转换失败，移除背景图片（避免公众号显示异常）
        console.warn(`Failed to convert background image: ${rawUrl}, removing it for WeChat compatibility`);
        nextStyle = nextStyle.replace(match[0], 'none');
        continue;
      }
      
      // 检查 base64 大小（粗略估算）
      const estimatedSize = dataUrl.length * 0.75; // base64 约为原文件的 1.33 倍
      if (estimatedSize > 150 * 1024) {
        console.warn(`Background image too large (${Math.round(estimatedSize / 1024)}KB): ${rawUrl}, removing for WeChat compatibility`);
        nextStyle = nextStyle.replace(match[0], 'none');
        continue;
      }
      
      nextStyle = nextStyle.replace(match[0], `url("${dataUrl}")`);
    } catch {
      // 转换失败，移除背景图片
      nextStyle = nextStyle.replace(match[0], 'none');
      continue;
    }
  }

  return nextStyle;
}

async function inlineHtmlAssetUrls(html: string): Promise<string> {
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const allElements = Array.from(doc.body.querySelectorAll('*')) as HTMLElement[];

  for (const elem of allElements) {
    const styleAttr = elem.getAttribute('style');
    if (styleAttr && styleAttr.includes('url(')) {
      elem.setAttribute('style', await inlineStyleUrls(styleAttr));
    }

    if (elem.tagName === 'IMG') {
      const src = elem.getAttribute('src') || '';
      const dataUrl = await fetchAsDataUrl(src);
      if (dataUrl) {
        elem.setAttribute('src', dataUrl);
      }
    }
  }

  return doc.body.innerHTML;
}

function flattenCollapsibleCodeBlocksForWeChat(html: string): string {
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('details.code-fold, summary.code-fold-summary').forEach((node) => node.remove());

  return doc.body.innerHTML;
}

/**
 * 生成微信公众号专用的HTML
 * 包含完整的样式包装，确保复制后样式不丢失
 */
export async function getWeChatHtml(
  contentHtml: string,
  containerStyle: string = ''
): Promise<string> {
  // 优化 base64 图片，同时把 blobUrl 图片替换为提示（blob 在公众号服务器无效）
  let optimizedHtml = optimizeBase64Images(contentHtml);
  optimizedHtml = optimizedHtml.replace(
    /src="blob:[^"]+"/g,
    'src="" alt="[图片上传中，请稍后重新复制]"'
  );
  optimizedHtml = await inlineHtmlAssetUrls(optimizedHtml);
  optimizedHtml = flattenCollapsibleCodeBlocksForWeChat(optimizedHtml);

  // 简化字体回退链，提高公众号兼容性
  let normalizedStyle = (containerStyle || 'max-width:677px;margin:0 auto;font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:15px;color:#333;line-height:1.8;')
    .replace(/-apple-system,\s*BlinkMacSystemFont,\s*"Segoe UI",\s*Roboto,\s*/gi, '')
    .replace(/-apple-system,\s*BlinkMacSystemFont,\s*/gi, '')
    .replace(/url\((['"]?)(\/[^)"]+)\1\)/gi, (_match, quote, path) => {
      if (typeof window === 'undefined') {
        return `url(${quote}${path}${quote})`;
      }
      return `url(${quote}${new URL(path, window.location.origin).toString()}${quote})`;
    });
  
  // 移除公众号不支持的 CSS 属性
  normalizedStyle = normalizedStyle
    .replace(/backdrop-filter:[^;]+;?/gi, '')
    .replace(/text-shadow:[^;]+;?/gi, '')
    .replace(/box-shadow:\s*0\s+0\s+[^;]+;?/gi, '') // 移除发光效果的 box-shadow
    .replace(/-webkit-background-clip:[^;]+;?/gi, '')
    .replace(/-webkit-text-fill-color:[^;]+;?/gi, '')
    .replace(/background-clip:[^;]+;?/gi, '');
  
  // 容器背景图保留 HTTPS URL，便于复制到公众号后继续访问在线资源。
  // 正文内部图片仍在上方按需内联，避免 blob/local 资源失效。
  const style = normalizedStyle;

  // 如果包含背景图，添加微信特有的容器属性
  const isImageBg = style.includes('background-image') && !style.includes('background-image:none');
  const copySafeSpacing =
    'box-sizing:border-box;padding:24px 22px 32px;max-width:677px;margin:0 auto;';
  const finalContainerStyle = isImageBg
    ? `${style};${copySafeSpacing}background-attachment:scroll;background-size:cover;`
    : `${style};${copySafeSpacing}`;

  // 添加暗黑模式适配
  const section = document.createElement('section');
  section.setAttribute('style', finalContainerStyle);
  section.innerHTML = optimizedHtml;

  const innerContent = section.querySelector('#chicpage') as HTMLElement | null;
  if (innerContent) {
    innerContent.style.padding = '0';
    innerContent.style.paddingLeft = '0';
    innerContent.style.paddingRight = '0';
    innerContent.style.maxWidth = '100%';
    innerContent.style.marginLeft = '0';
    innerContent.style.marginRight = '0';
  }
  
  // 为容器添加暗黑模式属性
  if (finalContainerStyle.includes('background-color')) {
    const bgMatch = finalContainerStyle.match(/background-color:\s*([^;]+)/);
    if (bgMatch) {
      section.setAttribute('data-darkmode-bgcolor', bgMatch[1].trim());
      section.setAttribute('data-darkmode-original-bgcolor', bgMatch[1].trim());
    }
  }

  return section.outerHTML;
}
