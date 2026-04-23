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
    padding-left: 22px;
    padding-right: 22px;
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
    containerStyle: 'max-width:677px;margin:0 auto;color:#3d3d3a;font-family:"Source Han Sans","Inter","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background:#fdf6e6;',
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
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"Inter","PingFang SC",sans-serif;color:#181716;background-color:#ece7db;background-image:url("/background/post.png");background-repeat:repeat;background-size:cover;background-position:center top;',
    css: BASE_CSS + `
      #chicpage { 
        color: #181716; 
        font-family: "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; 
        background-color: #ece7db;
        background-image:
          linear-gradient(180deg, rgba(245, 241, 231, 0.18) 0%, rgba(245, 241, 231, 0.1) 100%),
          url("/background/post.png");
        background-repeat: no-repeat, repeat;
        background-size: 100% 100%, cover;
        background-position: center top, center top;
        background-blend-mode: screen, normal;
        line-height: 1.9;
        letter-spacing: 0.01em;
      }

      /* H1：报头标题 */
      #chicpage h1 {
        font-family: "Newsreader", "Noto Serif SC", Georgia, "Times New Roman", serif;
        font-size: 38px;
        font-weight: 600;
        text-align: center;
        letter-spacing: 0.08em;
        color: #111111;
        padding: 0;
        margin: 0.55em 0 1.15em;
        line-height: 1.08;
        text-transform: uppercase;
      }

      /* H2：报刊栏目标签 */
      #chicpage h2 {
        display: block;
        background: transparent;
        color: #111111;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.36em;
        padding: 0;
        margin: 2.8em 0 1.05em;
        line-height: 1;
        text-transform: uppercase;
      }

      /* H3：新闻小标题 */
      #chicpage h3 {
        font-family: "Newsreader", "Noto Serif SC", Georgia, serif;
        font-size: 22px;
        font-weight: 500;
        color: #1a1a1a;
        margin: 1.75em 0 0.65em;
        letter-spacing: 0.02em;
      }

      #chicpage p {
        margin: 1.08em 0;
        line-height: 1.92;
        color: #2d2d2d;
        font-size: 15px;
        text-align: justify;
      }

      #chicpage ul, #chicpage ol {
        margin: 1.1em 0;
        padding-left: 1.25em;
      }

      #chicpage li {
        margin: 0.55em 0;
        color: #2d2d2d;
      }

      /* 引用：报刊摘句 */
      #chicpage blockquote {
        position: relative;
        margin: 3.2em 0;
        padding: 2em 2.2em 1.9em;
        background: rgba(248, 244, 235, 0.76);
        text-align: center;
        box-shadow: 0 8px 22px rgba(41, 34, 26, 0.04);
        backdrop-filter: blur(1px);
      }
      #chicpage blockquote p {
        font-size: 23px;
        font-family: "Newsreader", Georgia, serif;
        font-style: italic;
        font-weight: 400;
        line-height: 1.58;
        color: #1f1f1f;
        text-indent: 0;
        margin: 0;
      }
      #chicpage blockquote p::before { content: "“"; font-size: 1.35em; vertical-align: -0.32em; margin-right: 6px; color: rgba(17,17,17,0.28); }
      #chicpage blockquote p::after { content: "”"; font-size: 1.35em; vertical-align: -0.32em; margin-left: 6px; color: rgba(17,17,17,0.28); }

      #chicpage hr {
        border: none;
        height: 1px;
        background: rgba(17,17,17,0.14);
        margin: 3.4em 8%;
      }

      #chicpage strong {
        font-weight: 700;
        color: #111111;
        background: linear-gradient(180deg, transparent 56%, rgba(17,17,17,0.08) 56%);
        padding: 0 0.08em;
      }
      #chicpage em {
        font-style: italic;
        color: #4a4a4a;
      }
      #chicpage a {
        color: #111111;
        font-weight: 600;
        text-decoration: underline;
        text-decoration-color: rgba(17,17,17,0.35);
        text-underline-offset: 4px;
      }
      
      #chicpage li::marker {
        color: #111111;
        font-weight: 700;
      }
      
      #chicpage table {
        background: rgba(248, 244, 235, 0.72);
        box-shadow: 0 8px 22px rgba(41, 34, 26, 0.03);
      }
      #chicpage th {
        background: rgba(17,17,17,0.04);
        border: none;
        color: #111111;
        font-size: 11px;
        letter-spacing: 0.16em;
        padding: 11px 14px;
        text-transform: uppercase;
      }
      #chicpage td {
        border: none;
        padding: 12px 14px;
        color: #343434;
        background: transparent;
      }
      
      #chicpage code {
        background: rgba(248, 244, 235, 0.9);
        color: #111111;
        padding: 0.2em 0.42em;
        font-size: 85%;
        border-radius: 6px;
      }
      #chicpage pre {
        background: rgba(28, 26, 24, 0.96);
        color: #f7f1e3;
        padding: 1.5em;
        border-radius: 10px;
        box-shadow: 0 12px 28px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(255,255,255,0.04);
      }
      #chicpage img {
        background: rgba(248, 244, 235, 0.72);
        padding: 8px;
        border-radius: 10px;
        box-shadow: 0 14px 30px rgba(17,17,17,0.08);
      }
      #chicpage details {
        background: rgba(248, 244, 235, 0.8);
        box-shadow: 0 8px 20px rgba(41, 34, 26, 0.03);
      }
      #chicpage details[open] summary {
        border-bottom: none;
      }
      #chicpage summary {
        color: #1f1f1f;
      }
    `,
    preview: 'url("/background/post.png") center/cover no-repeat',
  },
  {
    id: 'crimson',
    name: '赤红',
    description: '东方赤红美学',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"Noto Serif SC","STSong",serif;color:#1a1a1a;background:#fef8f6;',
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
        padding: 0;
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
        opacity: 0.12;
      }

      /* 列表 */
      #chicpage li::marker {
        color: #c41e3a;
      }

      /* 表格 */
      #chicpage th {
        background: rgba(196, 30, 58, 0.06);
        color: #c41e3a;
        font-weight: 600;
        border: none;
        padding: 12px 16px;
      }
      #chicpage td {
        border: none;
        padding: 12px 16px;
        color: #3a3a3a;
        background: rgba(255,255,255,0.28);
      }
      #chicpage tr:nth-child(even) td {
        background: rgba(196, 30, 58, 0.02);
      }
    `,
    preview: '#fef8f6',
  },
  {
    id: 'sketch',
    name: '手绘',
    description: '克制手作纸感',
    containerStyle: 'max-width:677px;margin:0 auto;background:#fcfbf7;color:#2f2c28;font-family:"PingFang SC",sans-serif;',
    css: BASE_CSS + `
      #chicpage { 
        background-color: #fcfbf7;
        background-image:
          linear-gradient(180deg, rgba(72, 63, 51, 0.012) 0%, rgba(72, 63, 51, 0.004) 100%),
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0%, transparent 42%);
        color: #2f2c28; 
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        line-height: 1.9; 
        padding: 2em 22px;
        letter-spacing: 0.01em;
      }

      /* H1：像压在手工纸上的标题签 */
      #chicpage h1 {
        font-size: 30px;
        color: #1f1d1a;
        text-align: center;
        margin: 1em 0 0.95em;
        padding: 14px 18px 12px;
        background: rgba(255,255,255,0.6);
        border-radius: 18px 16px 20px 14px;
        box-shadow: 0 10px 24px rgba(56, 48, 40, 0.06);
        font-weight: 700;
      }

      /* H2：低饱和便签条 */
      #chicpage h2 {
        font-size: 20px;
        color: #2d2a25;
        display: inline-block;
        padding: 8px 16px 7px;
        margin: 2.3em 0 1em;
        background: rgba(210, 198, 170, 0.34);
        border-radius: 14px 12px 16px 10px;
        font-weight: 600;
      }

      /* H3：铅笔下划线感 */
      #chicpage h3 {
        font-size: 18px;
        color: #1f1d1a;
        margin: 1.7em 0 0.75em;
        display: inline-block;
        font-weight: 600;
      }

      #chicpage p {
        color: #3a352f;
        line-height: 1.95;
      }

      /* 引用：轻手工卡片 */
      #chicpage blockquote {
        margin: 2.8em 0;
        padding: 1.35em 1.5em;
        background: rgba(255,255,255,0.56);
        border-radius: 18px 14px 16px 12px;
        box-shadow: 0 8px 20px rgba(64, 57, 46, 0.04);
      }

      /* 强调样式：低饱和手工标记 */
      #chicpage strong { 
        font-weight: 700;
        color: #1f1d1a; 
        background: linear-gradient(180deg, transparent 54%, rgba(190, 181, 146, 0.45) 54%);
        padding: 0 2px;
      }
      #chicpage em {
        font-style: italic;
        color: #6e6254;
      }
      #chicpage a {
        color: #5e5245;
        border-bottom: 1px solid rgba(94, 82, 69, 0.36);
        text-decoration: none;
      }

      #chicpage hr {
        border: none;
        height: 1px;
        background: rgba(92, 81, 69, 0.12);
        margin: 3.2em 0;
      }

      /* 图片：轻贴纸效果 */
      #chicpage img { 
        padding: 10px;
        background: rgba(255,255,255,0.72);
        border-radius: 16px 14px 18px 12px;
        margin: 2.2em auto;
        box-shadow: 0 10px 24px rgba(56, 48, 40, 0.05);
      }
      
      #chicpage li {
        list-style: disc;
        padding-left: 0;
        color: #3a352f;
      }
      
      #chicpage code {
        background: rgba(94, 82, 69, 0.08);
        color: #4c4339;
        border-radius: 8px;
      }
      #chicpage pre {
        background: #2d2a26;
        border-radius: 16px;
      }
    `,
    preview: '#fcfbf7',
  }
];

export const getTheme = (id: string) =>
  WECHAT_THEMES.find(t => t.id === id) ?? WECHAT_THEMES[0];
