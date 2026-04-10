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
function applyWeChatOptimizations(elem: HTMLElement): void {
  const tag = elem.tagName;

  // 图片优化 - 确保图片在微信中正常显示
  if (tag === 'IMG') {
    const src = elem.getAttribute('src') || '';
    const isBase64 = src.startsWith('data:image');

    // 基础样式
    elem.style.maxWidth = '100%';
    elem.style.height = 'auto';
    elem.style.display = 'block';
    elem.style.margin = '1.5em auto'; // 增加垂直间距
    elem.style.borderRadius = '8px'; // 默认圆角

    // 移除可能干扰的样式
    elem.style.border = 'none';
    elem.style.outline = 'none';

    // 如果是 base64 图片，添加特殊处理
    if (isBase64) {
      elem.style.verticalAlign = 'middle';
    }
  }

  // 代码块优化 - 微信对 pre/code 的支持非常有限
  if (tag === 'PRE') {
    elem.style.margin = '1.5em 0';
    elem.style.padding = '1em';
    // 使用 rgba 以在暗黑模式下有更好的适应性
    elem.style.backgroundColor = 'rgba(40, 44, 52, 0.95)'; 
    elem.style.borderRadius = '8px';
    elem.style.overflowX = 'auto';
    elem.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    elem.style.lineHeight = '1.5';
    elem.style.fontSize = '14px';
    // 强制声明文字颜色，防止被微信暗黑模式反色导致看不清
    elem.style.color = '#abb2bf';
  }

  if (tag === 'CODE') {
    // 区分行内代码和块代码
    const isInline = !elem.parentElement || elem.parentElement.tagName !== 'PRE';
    
    if (isInline) {
      elem.style.backgroundColor = 'rgba(27,31,35,0.05)';
      elem.style.color = '#e06c75';
      elem.style.padding = '0.2em 0.4em';
      elem.style.borderRadius = '3px';
      elem.style.fontSize = '85%';
      elem.style.fontFamily = 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace';
    } else {
      elem.style.fontFamily = 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace';
      elem.style.display = 'block';
      elem.style.whiteSpace = 'pre'; // 保持原样换行
      elem.style.wordBreak = 'normal';
      elem.style.wordSpacing = 'normal';
      elem.style.color = 'inherit';
    }
  }

  // 引用块优化 - 只处理间距，颜色由主题 CSS 决定
  if (tag === 'BLOCKQUOTE') {
    elem.style.padding = '1em 1.2em';
    elem.style.margin = '1.5em 0';
    elem.style.fontSize = '0.95em';
    elem.style.borderRadius = '0 8px 8px 0';
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
    if (tag === 'H1') elem.style.fontSize = '1.6em';
    if (tag === 'H2') elem.style.fontSize = '1.4em';
    if (tag === 'H3') elem.style.fontSize = '1.2em';
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
    elem.style.borderTop = '1px dashed #e5e7eb';
    elem.style.margin = '2.5em 0';
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
  options: { wechatOptimized?: boolean } = {}
): string {
  const { wechatOptimized = true } = options;

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
      applyWeChatOptimizations(c);

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
  wrapper.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
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
      if (!dataUrl) continue;
      nextStyle = nextStyle.replace(match[0], `url("${dataUrl}")`);
    } catch {
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

  const normalizedStyle = (containerStyle || 'max-width:677px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;font-size:15px;color:#333;line-height:1.8;').replace(
    /url\((['"]?)(\/[^)"]+)\1\)/gi,
    (_match, quote, path) => {
      if (typeof window === 'undefined') {
        return `url(${quote}${path}${quote})`;
      }

      return `url(${quote}${new URL(path, window.location.origin).toString()}${quote})`;
    }
  );
  
  // 核心黑科技：微信对 background-color 比较友好，对 background-image 建议使用单独的 div 承载
  const style = await inlineStyleUrls(normalizedStyle);

  // 如果包含背景图，添加一些微信特有的容器属性
  const isImageBg = style.includes('background-image');
  const finalContainerStyle = isImageBg 
    ? `${style};background-attachment:scroll;-webkit-background-size:cover;`
    : style;

  return `<section style="${finalContainerStyle}">${optimizedHtml}</section>`;
}
