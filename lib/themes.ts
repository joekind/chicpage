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
    font-size: 15px; 
    line-height: 1.8; 
    word-break: break-word; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
    
  }
  #chicpage h1 { font-size: 24px; font-weight: 700; line-height: 1.3; }
  #chicpage h2 { font-size: 20px; font-weight: 700; margin: 1.8em 0 0.8em; line-height: 1.3; }
  #chicpage h3 { font-size: 18px; font-weight: 700; margin: 1.6em 0 0.6em; line-height: 1.3; }
  #chicpage h4, #chicpage h5, #chicpage h6 { font-size: 16px; font-weight: 700; margin: 1.4em 0 0.5em; }
  #chicpage p { margin: 1em 0; line-height: 1.75; }
  #chicpage ul, #chicpage ol { padding-left: 1.8em; margin: 1em 0; }
  #chicpage li { margin: 0.5em 0; line-height: 1.75; }
  #chicpage blockquote { margin: 1.5em 0; padding: 12px 20px; font-style: normal; border-radius: 0; }
  #chicpage blockquote p { margin: 0.5em 0; }
  #chicpage blockquote p:first-child { margin-top: 0; }
  #chicpage blockquote p:last-child { margin-bottom: 0; }
  #chicpage strong { font-weight: 700; }
  #chicpage em { font-style: italic; }
  #chicpage a { text-decoration: none; }
  #chicpage hr { border: none; margin: 2.5em 0; }
  #chicpage img { max-width: 100%; height: auto; display: block; margin: 1.5em auto; border-radius: 12px; }
  #chicpage table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 14.5px; }
  #chicpage th { font-weight: 700; padding: 10px 14px; text-align: left; }
  #chicpage td { padding: 10px 14px; }
  #chicpage details { margin: 1.2em 0; border: 1px solid #e5e7eb; border-radius: 10px; background: #fafafa; overflow: hidden; }
  #chicpage summary { cursor: pointer; list-style: none; padding: 10px 14px; font-weight: 600; user-select: none; }
  #chicpage summary::-webkit-details-marker { display: none; }
  #chicpage details > :not(summary) { padding: 0 14px 12px; }
  #chicpage details[open] summary { border-bottom: 1px solid #e5e7eb; margin-bottom: 8px; }
  #chicpage code { font-size: 85%; padding: 0.2em 0.4em; border-radius: 4px; font-family: Consolas, "Courier New", monospace; }
  #chicpage pre { margin: 1.5em 0; border-radius: 10px; overflow: hidden; }
  #chicpage pre code { display: block; padding: 1.2em; font-size: 13px; line-height: 1.6; }
  #chicpage kbd { display: inline-block; padding: 2px 6px; font-size: 12px; font-family: Consolas, "Courier New", monospace; line-height: 1.4; color: #444; background: #f6f8fa; border: 1px solid #d0d7de; border-bottom-width: 2px; border-radius: 4px; }
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
    id: 'elegant',
    name: '典雅',
    description: '典雅精致风格',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:Georgia,"Noto Serif SC","STSong","SimSun",serif;color:#2c2c2c;background:#fdfaf6;padding:32px 24px;',
    css: BASE_CSS + `
      #chicpage { color: #2c2c2c; font-family: Georgia, "Noto Serif SC", "STSong", "SimSun", serif; line-height: 1.9; background: #fdfaf6; }

      /* 标题：居中 + 金色下划线装饰 */
      #chicpage h1 {
        color: #1a1a1a; text-align: center; font-size: 24px;
        font-weight: 400; letter-spacing: 0.15em;
        padding-bottom: 0.6em; margin-bottom: 0.4em;
        border-bottom: 1px solid #c8a96e;
      }

      #chicpage h2 {
        color: #1a1a1a; font-size: 17px; font-weight: 600;
        letter-spacing: 0.08em;
        padding: 0 0 6px 12px;
        border-bottom: 1px solid #e0cfa8;
        border-left: 3px solid #c8a96e;
        margin: 2em 0 0.8em;
      }

      #chicpage h3 { color: #3a3a3a; font-size: 15px; font-weight: 600; margin: 1.5em 0 0.5em; padding-left: 12px; border-left: 2px solid #c8a96e; }

      /* 段落首行缩进，且保持非常紧致的段间距，模拟真书排版 */
      #chicpage p { text-indent: 2em; margin: 0.3em 0; line-height: 1.95; }

      /* 引用：右侧竖线 + 斜体 + 淡金背景 */
      #chicpage blockquote {
        margin: 1.8em 0; padding: 14px 20px 14px 24px;
        border-left: none; border-right: 3px solid #c8a96e;
        background: #fdf6e8; color: #5a4a2a;
        font-style: italic; text-align: right;
      }
      #chicpage blockquote p { text-indent: 0; margin: 0; }

      #chicpage li::marker { color: #c8a96e; }
      #chicpage strong { color: #1a1a1a; font-weight: 700; }
      #chicpage em { color: #7a6040; }
      #chicpage a { color: #9a7040; text-decoration: underline; text-underline-offset: 3px; }

      /* 分割线：居中菱形 */
      #chicpage hr { border: none; border-top: 1px dashed #c8a96e; margin: 2.5em 0; text-align: center; }

      #chicpage th { background: #f5ead6; border: 1px solid #e0cfa8; color: #5a4a2a; font-weight: 600; }
      #chicpage td { border: 1px solid #e8dcc0; color: #3a3a3a; }
      #chicpage tr:nth-child(even) td { background: #fdf9f0; }
      #chicpage code { background: #f5ead6; color: #8a5c20; border-radius: 3px; font-size: 85%; }
      #chicpage pre code { background: #1e1e1e; color: #d4d4d4; }
      #chicpage kbd { background: #f5ead6; border-color: #c8a96e; color: #5a4a2a; }
    `,
    preview: '#fdfaf6',
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
        font-size: 32px; font-weight: 300; text-align: center;
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
        font-size: 12px; font-weight: 700;
        letter-spacing: 0.25em;
        padding: 6px 18px;
        margin: 2.2em 0 1.2em;
        line-height: 1;
        text-transform: uppercase;
      }

      /* H3：斜杠序列号感 */
      #chicpage h3 {
        font-size: 18px; font-weight: 700;
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
        font-size: 19px; font-family: Georgia, serif;
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
        font-size: 32px;
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
        border-left: 4px solid #c41e3a;
      }

      /* H3 */
      #chicpage h3 {
        font-size: 17px;
        font-weight: 600;
        color: #333;
        margin: 1.8em 0 0.8em;
        padding-left: 16px;
        border-left: 3px solid #c41e3a;
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
        border-left: 4px solid #c41e3a;
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
        border-left: 4px solid #6366f1;
        border-radius: 8px;
      }

      /* H3: 紫色强调 */
      #chicpage h3 {
        font-size: 17px;
        font-weight: 600;
        color: #c4b5fd;
        margin: 1.8em 0 0.8em;
        padding-left: 16px;
        border-left: 4px solid #6366f1;
      }

      /* 段落 */
      #chicpage p {
        color: #a1a1aa;
        margin: 1em 0;
        font-size: 15px;
        line-height: 1.9;
      }

      /* 引用：发光卡片 */
      #chicpage blockquote {
        margin: 2em 0;
        padding: 20px 24px;
        background: rgba(99, 102, 241, 0.05);
        border: 1px solid rgba(99, 102, 241, 0.15);
        border-left: 4px solid #6366f1;
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
        font-size: 30px; color: #000; text-align: center;
        margin: 1.25em 0 1em;
        padding: 10px 20px;
        background: #fff;
        border: 2px solid #111;
        border-radius: 15px;
      }

      /* H2：带涂鸦阴影的便签 */
      #chicpage h2 {
        font-size: 22px; color: #111;
        display: inline-block; padding: 8px 20px;
        margin: 2.5em 0 1.2em;
        border: 2px solid #333;
        background: #ffeb3b;
        border-radius: 15px;
      }

      /* H3：彩色蜡笔波浪线下划线 */
      #chicpage h3 {
        font-size: 19px; color: #000; margin: 1.8em 0 0.8em;
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
