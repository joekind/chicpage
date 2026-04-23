/**
 * ChicPage 公众号主题系统
 * 根选择器统一用 #chicpage，CSS 只写标签选择器，主题间只改颜色/字体差异
 */

export interface WechatTheme {
  id: string;
  name: string;
  description: string;
  /** 预览区注入的 <style> 内容，根选择器为 #chicpage */
  css: string;
  /** 复制时包裹容器的 inline style */
  containerStyle: string;
  /** 预览色块的颜色/渐变 */
  preview: string;
}

// 所有主题共用的基础结构样式（标签选择器，挂在 #chicpage 下）
const BASE_CSS = `
  #chicpage, #chicpage * { box-sizing: border-box; }
  #chicpage { 
    font-size: 16px; 
    line-height: 1.8; 
    word-break: break-word; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }
  #chicpage h1 { font-size: 1.85em; font-weight: 700; line-height: 1.25; margin: 1.35em 0 0.75em; letter-spacing: -0.01em; }
  #chicpage h2 { font-size: 1.5em; font-weight: 700; margin: 1.45em 0 0.7em; line-height: 1.28; letter-spacing: -0.005em; }
  #chicpage h3 { font-size: 1.22em; font-weight: 700; margin: 1.2em 0 0.55em; line-height: 1.32; }
  #chicpage h4, #chicpage h5, #chicpage h6 { font-size: 1.06em; font-weight: 700; margin: 1em 0 0.45em; line-height: 1.34; }
  #chicpage p { margin: 0.95em 0; line-height: 1.8; font-size: 1em; }
  #chicpage ul, #chicpage ol { padding-left: 1.7em; margin: 0.95em 0; }
  #chicpage li { margin: 0.35em 0; line-height: 1.8; font-size: 1em; }
  #chicpage blockquote { margin: 1.6em 0; padding: 14px 18px; font-style: normal; border-radius: 12px; }
  #chicpage blockquote p { margin: 0.4em 0; }
  #chicpage blockquote p:first-child { margin-top: 0; }
  #chicpage blockquote p:last-child { margin-bottom: 0; }
  #chicpage strong { font-weight: 700; }
  #chicpage em { font-style: italic; }
  #chicpage a { text-decoration: none; }
  #chicpage hr { border: none; margin: 2.8em 0; opacity: 0.9; }
  #chicpage img { max-width: 100%; height: auto; display: block; margin: 1.5em auto; border-radius: 14px; }
  #chicpage table { width: 100%; border-collapse: collapse; margin: 1.6em 0; font-size: 0.94em; }
  #chicpage th { font-weight: 700; padding: 11px 14px; text-align: left; }
  #chicpage td { padding: 11px 14px; }
  #chicpage details { margin: 1.25em 0; border: 1px solid #e5e7eb; border-radius: 14px; background: #fafafa; overflow: hidden; }
  #chicpage summary { cursor: pointer; list-style: none; padding: 11px 14px; font-weight: 600; user-select: none; }
  #chicpage summary::-webkit-details-marker { display: none; }
  #chicpage details > :not(summary) { padding: 0 14px 12px; }
  #chicpage details[open] summary { border-bottom: 1px solid #e5e7eb; margin-bottom: 8px; }
  #chicpage code { font-size: 0.88em; padding: 0.18em 0.42em; border-radius: 5px; font-family: Consolas, "Courier New", monospace; }
  #chicpage pre { margin: 1.6em 0; border-radius: 14px; overflow-x: auto; overflow-y: hidden; background: #f8fafc; }
  #chicpage pre code { display: block; padding: 1.05em 1.15em; font-size: 0.9em; line-height: 1.75; font-family: Consolas, "Courier New", monospace; background: transparent; color: inherit; }
  #chicpage .hljs { color: #334155; }
  #chicpage .hljs-keyword,
  #chicpage .hljs-selector-tag,
  #chicpage .hljs-literal,
  #chicpage .hljs-title,
  #chicpage .hljs-section,
  #chicpage .hljs-doctag,
  #chicpage .hljs-type,
  #chicpage .hljs-name,
  #chicpage .hljs-strong { color: #7c3aed; }
  #chicpage .hljs-string,
  #chicpage .hljs-attr,
  #chicpage .hljs-template-tag,
  #chicpage .hljs-template-variable,
  #chicpage .hljs-bullet { color: #0d9488; }
  #chicpage .hljs-number,
  #chicpage .hljs-symbol,
  #chicpage .hljs-variable,
  #chicpage .hljs-params,
  #chicpage .hljs-link { color: #2563eb; }
  #chicpage .hljs-comment,
  #chicpage .hljs-quote { color: #64748b; font-style: italic; }
  #chicpage kbd { display: inline-block; padding: 2px 6px; font-size: 12px; font-family: Consolas, "Courier New", monospace; line-height: 1.4; color: #444; background: #f6f8fa; border: 1px solid #d0d7de; border-bottom-width: 2px; border-radius: 5px; }
  #chicpage input[type="checkbox"] { margin-right: 6px; accent-color: #6366f1; pointer-events: none; }
`;

export const WECHAT_THEMES: WechatTheme[] = [
  {
    id: 'default',
    name: '默认',
    description: '经典简约排版',
    containerStyle: 'max-width:677px;margin:0 auto;color:#333;font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background-color:#ffffff;',
    css: BASE_CSS + `
      #chicpage {
        color: #333;
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
       
        }
      #chicpage h1 { color: #111; font-size: 28px; font-weight: 700; margin: 1em 0 0.9em 0; letter-spacing: -0.02em; }
      #chicpage h2 { color: #111; font-size: 22px; font-weight: 600; margin: 1.25em 0 0.85em 0; letter-spacing: -0.01em; }
      #chicpage h3 { color: #222; font-size: 19px; font-weight: 600; margin: 1.15em 0 0.8em 0; }
      #chicpage p { font-size: 17px; margin: 0.95em 0; line-height: 1.82; color: #374151; }
      #chicpage blockquote { background: #f9fafb;  color: #4b5563; padding: 1.15em 1.45em; border-radius: 14px; }
      #chicpage li { list-style: disc; margin: 0.5em 0;}
      #chicpage ul, #chicpage ol { margin: 1.05em 0;padding-left: 1.1em; }
      #chicpage a { color: #2563eb; text-decoration: underline; text-underline-offset: 4px; }
      #chicpage hr { border-top: 1px solid #f3f4f6; margin: 2.8em 0; }
      #chicpage img { max-width: 100%; height: auto; display: block; margin: 1.5em auto; border-radius: 10px; }
      #chicpage blockquote { margin: 1.45em 0; padding: 12px 20px; font-style: normal; border-radius: 14px;border-left:0px}
    `,
    preview: '#ffffff',
  },
  {
    id: '暖纸',
    name: '暖纸',
    description: '极简高对比排版',
    containerStyle: 'max-width:677px;margin:0 auto;padding:28px 22px 32px;color:#3d3d3a;font-family:"Source Han Sans","Inter","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background:#fdf6e6;',
    css: BASE_CSS + `
      #chicpage {
        color: #3d3d3a;
        font-family: "Source Han Sans", "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        background: #fdf6e6;
        padding: 28px 22px 32px;
        line-height: 1.55;
      }
      #chicpage, #chicpage * {
        font-weight: 400;
      }
      #chicpage h1 {
        color: #141413;
        font-family: Georgia, "Noto Serif SC", "Songti SC", "TsangerJinKai02", serif;
        font-size: 34px;
        font-weight: 500;
        letter-spacing: -0.03em;
        margin: 0.2em 0 0.8em;
        line-height: 1.18;
      }
      #chicpage h2 {
        color: #141413;
        font-family: Georgia, "Noto Serif SC", "Songti SC", "TsangerJinKai02", serif;
        font-size: 24px;
        font-weight: 500;
        letter-spacing: -0.02em;
        margin: 1.8em 0 0.9em;
        padding-left: 0;
        border-left: none;
        line-height: 1.22;
      }
      #chicpage h3 {
        color: #141413;
        font-family: Georgia, "Noto Serif SC", "Songti SC", "TsangerJinKai02", serif;
        font-size: 20px;
        font-weight: 500;
        margin: 1.4em 0 0.6em;
        line-height: 1.25;
      }
      #chicpage p {
        color: #4d4c48;
        font-size: 17px;
        line-height: 1.55;
        margin: 1em 0;
      }
      #chicpage li {
        color: #4d4c48;
        line-height: 1.55;
        margin: 0.45em 0;
      }
      #chicpage strong {
        font-weight: 500;
        color: #141413;
      }
      #chicpage em {
        color: #5e5d59;
      }
      #chicpage a {
        color: #1b365d;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
      }
      #chicpage blockquote {
        background: #fffbf1;
        color: #4d4c48;
        border: 1px solid #eadbbd;
        border-radius: 16px;
        padding: 16px 18px;
        box-shadow: 0 0 0 1px #eadbbd;
      }
      #chicpage hr {
        border-top: 1px solid #e6d5b3;
        margin: 3em 0;
      }
      #chicpage img {
        border-radius: 16px;
        box-shadow: 0 0 0 1px #eadbbd;
      }
      #chicpage pre {
        background: #fffbf1;
        border: 1px solid #eadbbd;
        border-radius: 16px;
      }
      #chicpage pre code {
        color: #3d3d3a;
        background: transparent;
        font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
      }
      #chicpage code {
        background: #f5e7c9;
        color: #1b365d;
        border-radius: 6px;
        font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
      }
      #chicpage table {
        border: 1px solid #e6d5b3;
        border-radius: 16px;
        overflow: hidden;
      }
      #chicpage th {
        background: #1b365d;
        color: #ffffff;
        font-weight: 500;
        line-height: 1.35;
      }
      #chicpage td {
        border-top: 1px solid #e6d5b3;
        line-height: 1.45;
      }
      #chicpage details {
        background: #fffbf1;
        border-radius: 16px;
        border: 1px solid #e6d5b3;
      }
      #chicpage summary {
        font-family: Georgia, "Noto Serif SC", "Songti SC", "TsangerJinKai02", serif;
        font-weight: 500;
        color: #141413;
        line-height: 1.3;
      }
      #chicpage kbd {
        background: #f5e7c9;
        color: #3d3d3a;
        border: 1px solid #e0cda9;
        border-bottom-width: 1px;
      }
    `,
    preview: '#fdf6e6',
  },
  {
    id: 'linedpaper2',
    name: '纸质',
    description: '简约排版',
    containerStyle: 'max-width:677px;margin:0 auto;color:#333;font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background-color:#ffffff;background-image:url("/background/lined-paper-2.png");background-repeat:repeat;background-size:auto;',
    css: BASE_CSS + `
      #chicpage {
        color: #333;
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
       
        }
      #chicpage h1 { color: #111; font-size: 28px; font-weight: 700; margin: 1em 0 1em 0; }
      #chicpage h2 { color: #111; font-size: 22px; font-weight: 600; margin: 1.2em 0 1em 0; }
      #chicpage h3 { color: #222; font-size: 19px; font-weight: 600; margin: 1.2em 0 1em 0; }
      #chicpage p { font-size: 16px; margin: 1em 0; line-height: 1.8; color: #374151; }
      #chicpage blockquote { background: #f9fafb;  color: #4b5563; padding: 1.2em 1.5em; }
      #chicpage li { list-style: disc; margin: 0.6em 0;}
      #chicpage ul, #chicpage ol { margin: 1.2em 0;padding-left: 1em; }
      #chicpage a { color: #2563eb; text-decoration: underline; text-underline-offset: 4px; }
      #chicpage hr { border-top: 1px solid #f3f4f6; margin: 3em 0; }
      #chicpage img { max-width: 100%; height: auto; display: block; margin: 1.5em auto; border-radius: 0px; }
      #chicpage blockquote { margin: 1.5em 0; padding: 12px 20px; font-style: normal; border-radius: 8px;border-left:0px}
    `,
    preview: '#ffffff',
  },
  {
    id: 'magazine',
    name: '杂志',
    description: '时尚杂志排版',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"PingFang SC",sans-serif;color:#1a1a1a;background:#fff;',
    css: BASE_CSS + `
      #chicpage { 
        color: #1a1a1a; 
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; 
        background: #fff; 
        line-height: 1.85; 
      }

      /* H1：封面大标题，极简杂志风 */
      #chicpage h1 {
        font-size: 28px; font-weight: 300; text-align: center;
        letter-spacing: 0.3em; color: #000;
        padding: 0.8em 0;
        border-top: 5px solid #000;
        border-bottom: 2px solid #000;
        margin: 1.5em 0 1.2em;
        line-height: 1.3;
        text-transform: uppercase;
      }

      /* H2：编辑标签风格 */
      #chicpage h2 {
        display: inline-block;
        background: #000; color: #fff;
        font-size: 13px; font-weight: 700;
        letter-spacing: 0.25em;
        padding: 6px 18px;
        margin: 2.2em 0 1.2em;
        line-height: 1;
        text-transform: uppercase;
      }

      /* H3：斜杠序列号感 */
      #chicpage h3 {
        font-size: 20px; font-weight: 700;
        color: #1a1a1a; margin: 1.8em 0 0.8em;
        padding-bottom: 6px;
        border-bottom: 3px solid #f0f0f0;
      }

      /* 引用：经典的 Pull-Quote 风格 */
      #chicpage blockquote {
        margin: 3em 0; padding: 1.5em 2.5em;
        border: none; background: #fdfdfd;
        text-align: center;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }
      #chicpage blockquote p {
        font-size: 20px; font-family: Georgia, serif;
        font-style: italic; line-height: 1.6; color: #333;
        text-indent: 0; margin: 0;
      }
      #chicpage blockquote p::before { content: "“"; font-size: 1.6em; vertical-align: -0.4em; margin-right: 4px; color: #ccc; }
      #chicpage blockquote p::after { content: "”"; font-size: 1.6em; vertical-align: -0.4em; margin-left: 4px; color: #ccc; }

      /* 段落 */
      #chicpage p { margin: 1em 0; line-height: 1.85; }

      /* 分割线：极简长线 */
      #chicpage hr { border: none; border-top: 1px solid #1a1a1a; margin: 3.5em 10%; }

      /* 强调样式 */
      #chicpage strong { font-weight: 800; color: #000; background: #f0f0f0; padding: 0 0.2em; }
      #chicpage em { font-style: italic; color: #444; }
      #chicpage a { color: #000; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
      
      #chicpage li::marker { color: #000; font-weight: 700; }
      
      /* 表格：编辑部内表感 */
      #chicpage th { background: #000; border: none; color: #fff; font-size: 11px; letter-spacing: 0.1em; padding: 10px 14px; text-transform: uppercase; }
      #chicpage td { border: none; border-bottom: 1px solid #eee; padding: 10px 14px; }
      
      #chicpage code { background: #f6f6f6; color: #111; padding: 0.2em 0.4em; font-size: 85%; }
      #chicpage pre { background: #000; color: #fff; padding: 1.5em; border-radius: 4px; }
    `,
    preview: '#ffffff',
  },
  {
    id: 'crimson',
    name: '赤红',
    description: '东方赤红美学',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"Noto Serif SC","STSong",serif;color:#1a1a1a;background:#fef8f6;padding:40px 30px;',
    css: BASE_CSS + `
      #chicpage {
        color: #1a1a1a;
        font-family: "Noto Serif SC", "STSong", "SimSun", serif;
        line-height: 1.95;
        background: #fef8f6;
      }

      /* H1: 竖排印章风格 */
      #chicpage h1 {
        font-size: 26px;
        font-weight: 900;
        color: #1a1a1a;
        text-align: center;
        letter-spacing: 0.5em;
        margin: 1.5em 0 1em;
        padding: 20px 0;
        border: 2px solid rgba(196, 30, 58, 0.3);
        border-radius: 8px;
      }

      /* H2: 红色装饰框 */
      #chicpage h2 {
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 2.5em 0 1.2em;
        padding: 12px 20px;
        background: rgba(196, 30, 58, 0.05);
        border-left: none;
      }

      /* H3 */
      #chicpage h3 {
        font-size: 17px;
        font-weight: 600;
        color: #333;
        margin: 1.8em 0 0.8em;
        padding-left: 0;
        border-left: none;
      }

      /* 段落：两端对齐 */
      #chicpage p {
        font-size: 15px;
        color: #3a3a3a;
        margin: 1em 0;
        text-align: justify;
        text-indent: 2em;
        line-height: 2;
      }
      #chicpage p:first-of-type {
        text-indent: 0;
      }

      /* 引用：水墨风格 */
      #chicpage blockquote {
        margin: 2.5em 0;
        padding: 20px 30px;
        border: none;
        background: rgba(196, 30, 58, 0.05);
        color: #5a3a3a;
      }
      #chicpage blockquote p {
        text-indent: 0;
        font-size: 15px;
        line-height: 1.9;
      }

      /* 链接 */
      #chicpage a {
        color: #c41e3a;
        text-decoration: none;
        border-bottom: 1px solid #c41e3a;
      }

      /* 强调 */
      #chicpage strong {
        color: #c41e3a;
        font-weight: 700;
      }

      /* 代码 */
      #chicpage code {
        background: rgba(196, 30, 58, 0.08);
        color: #c41e3a;
        padding: 0.2em 0.5em;
        border-radius: 4px;
        font-size: 85%;
      }

      /* 分割线：红色装饰 */
      #chicpage hr {
        border: none;
        margin: 3em 0;
        height: 1px;
        background: #c41e3a;
        opacity: 0.3;
      }

      /* 列表 */
      #chicpage li::marker {
        color: #c41e3a;
      }

      /* 表格 */
      #chicpage th {
        background: #c41e3a;
        color: #fff;
        font-weight: 600;
        border: none;
        padding: 12px 16px;
      }
      #chicpage td {
        border: 1px solid rgba(196, 30, 58, 0.1);
        padding: 12px 16px;
        color: #3a3a3a;
        background: #fff;
      }
      #chicpage tr:nth-child(even) td {
        background: rgba(196, 30, 58, 0.02);
      }
    `,
    preview: '#fef8f6',
  },
  {
    id: 'tech',
    name: '暗黑',
    description: '极客暗黑美学',
    containerStyle: 'max-width:677px;margin:0 auto;background:#0a0a0f;color:#e6e6e6;padding:32px 24px;font-family:-apple-system,"SF Pro Display",sans-serif;',
    css: BASE_CSS + `
      #chicpage {
        background: #0a0a0f;
        color: #e6e6e6;
        font-family: -apple-system, "SF Pro Display", "PingFang SC", sans-serif;
        padding: 2em 1.5em;
        line-height: 1.85;
        /* 科技感网格背景 */
        background-image:
          radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
        background-size: 100% 100%, 40px 40px, 40px 40px;
      }

      /* H1: 居中发光标题 */
      #chicpage h1 {
        font-size: 28px;
        font-weight: 700;
        margin: 1.5em 0 1em;
        text-align: center;
        color: #e6e6e6;
        letter-spacing: 0.02em;
        padding-bottom: 0.5em;
        border-bottom: 3px solid #6366f1;
      }

      /* H2: 科技感卡片 */
      #chicpage h2 {
        font-size: 20px;
        font-weight: 600;
        color: #e6e6e6;
        margin: 2.2em 0 1em;
        padding: 14px 20px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-left: none;
        border-radius: 8px;
      }

      /* H3: 紫色强调 */
      #chicpage h3 {
        font-size: 17px;
        font-weight: 600;
        color: #c4b5fd;
        margin: 1.8em 0 0.8em;
        padding-left: 0;
        border-left: none;
      }

      /* 段落 */
      #chicpage p {
        color: #a1a1aa;
        margin: 1em 0;
        font-size: 16px;
        line-height: 1.9;
      }

      /* 引用：发光卡片 */
      #chicpage blockquote {
        margin: 2em 0;
        padding: 20px 24px;
        background: rgba(99, 102, 241, 0.05);
        border: 1px solid rgba(99, 102, 241, 0.15);
        border-left: none;
        color: #c4b5fd;
        border-radius: 8px;
      }
      #chicpage blockquote p {
        color: #c4b5fd;
        margin: 0;
      }

      /* 链接：渐变效果 */
      #chicpage a {
        color: #818cf8;
        text-decoration: underline;
        text-underline-offset: 3px;
      }

      /* 强调 */
      #chicpage strong {
        color: #e6e6e6;
        font-weight: 600;
        background: rgba(99, 102, 241, 0.2);
        padding: 0.1em 0.3em;
        border-radius: 4px;
      }

      /* 代码：霓虹风格 */
      #chicpage code {
        background: rgba(99, 102, 241, 0.1);
        color: #a5b4fc;
        padding: 0.2em 0.6em;
        border-radius: 4px;
        font-size: 85%;
        border: 1px solid rgba(99, 102, 241, 0.2);
        font-family: "JetBrains Mono", "Fira Code", monospace;
      }

      /* 代码块 */
      #chicpage pre {
        background: #0d0d12;
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 12px;
        padding: 20px;
        overflow-x: auto;
      }
      #chicpage pre code {
        background: transparent;
        border: none;
        padding: 0;
        color: #a5b4fc;
      }

      /* 分割线：渐变光效 */
      #chicpage hr {
        border: none;
        margin: 3em 0;
        height: 2px;
        background: rgba(99, 102, 241, 0.5);
      }

      /* 列表 */
      #chicpage li {
        margin: 0.5em 0;
        line-height: 1.8;
        color: #a1a1aa;
      }
      #chicpage li::marker {
        color: #6366f1;
      }
      #chicpage ul, #chicpage ol {
        padding-left: 1.5em;
      }

      /* 表格：发光边框 */
      #chicpage table {
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(99, 102, 241, 0.2);
      }
      #chicpage th {
        background: rgba(99, 102, 241, 0.2);
        color: #e6e6e6;
        font-weight: 600;
        border: none;
        padding: 14px 18px;
        font-size: 13px;
        letter-spacing: 0.02em;
      }
      #chicpage td {
        border: none;
        border-top: 1px solid rgba(99, 102, 241, 0.1);
        padding: 14px 18px;
        color: #a1a1aa;
        background: transparent;
      }
      #chicpage tr:nth-child(even) td {
        background: rgba(99, 102, 241, 0.02);
      }

      /* 图片：发光边框 */
      #chicpage img {
        border-radius: 12px;
        border: 1px solid rgba(99, 102, 241, 0.1);
      }
    `,
    preview: '#0a0a0f',
  },
  {
    id: 'sketch',
    name: '手绘',
    description: '手绘涂鸦风格',
    containerStyle: 'max-width:677px;margin:0 auto;background:#fffef5;color:#333;padding:40px 30px;font-family:"PingFang SC",sans-serif;',
    css: BASE_CSS + `
      #chicpage { 
        background-color: #fffef5; 
        color: #1a1a1a; 
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        line-height: 1.85; 
        padding: 2em 1em;
      }

      /* H1：紧凑的手绘涂鸦背景 */
      #chicpage h1 {
        font-size: 32px; color: #000; text-align: center;
        margin: 1.25em 0 1em;
        padding: 10px 20px;
        background: #fff;
        border: 2px solid #111;
        border-radius: 15px;
      }

      /* H2：带涂鸦阴影的便签 */
      #chicpage h2 {
        font-size: 24px; color: #111;
        display: inline-block; padding: 8px 20px;
        margin: 2.5em 0 1.2em;
        border: 2px solid #333;
        background: #ffeb3b;
        border-radius: 15px;
      }

      /* H3：彩色蜡笔波浪线下划线 */
      #chicpage h3 {
        font-size: 20px; color: #000; margin: 1.8em 0 0.8em;
        display: inline-block;
        border-bottom: 4px dotted #ff4081;
      }

      /* 引用：四角贴了透明胶带的纸片 */
      #chicpage blockquote {
        margin: 3.5em 0; padding: 2em;
        background: #fff; border: 1px solid #ddd;
        border-radius: 4px;
      }

      /* 强调样式：极其厚重的涂鸦高亮 */
      #chicpage strong { 
        font-weight: 900; color: #000; 
        background: #fff176;
        padding: 0 4px;
        border-radius: 4px;
      }
      #chicpage em { font-style: italic; color: #2196f3; font-weight: 800; border-bottom: 2px solid #2196f3; }
      #chicpage a { color: #f44336; border-bottom: 3px double #f44336; text-decoration: none; }

      /* 分割线：大手绘波浪线 */
      #chicpage hr { border: none; border-top: 2px dashed #ccc; margin: 4em 0; }

      /* 图片：像贴在墙上的照片 */
      #chicpage img { 
        padding: 12px; border: 1px solid #ddd; background: #fff;
        border-radius: 2px;
        margin: 2.5em auto;
      }
      
      #chicpage li { list-style: disc; padding-left: 0; }
      
      #chicpage code { background: #e1f5fe; color: #0277bd; border: 1px dashed #0277bd; border-radius: 10px; }
      #chicpage pre { background: #1a1a1a; border: 3px solid #333; border-radius: 15px; }
    `,
    preview: '#ffeb3b',
  }
];

export const getTheme = (id: string) =>
  WECHAT_THEMES.find(t => t.id === id) ?? WECHAT_THEMES[0];
