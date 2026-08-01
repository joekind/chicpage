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
  #chicpage ul { list-style-type: disc; }
  #chicpage ol { list-style-type: decimal; }
  #chicpage li { margin: 0.35em 0; line-height: 1.8; font-size: 1em; list-style: inherit; }
  #chicpage ul.contains-task-list { list-style: none; padding-left: 0; }
  #chicpage li.task-list-item { list-style: none; }
  #chicpage li.task-list-item input[type="checkbox"] { margin-right: 8px; vertical-align: -0.12em; }
  #chicpage blockquote { margin: 1.6em 0; padding: 14px 18px; font-style: normal; font-weight: 400; border-radius: 12px; }
  #chicpage blockquote p { margin: 0.4em 0; font-weight: 400; }
  #chicpage blockquote p:first-child { margin-top: 0; }
  #chicpage blockquote p:last-child { margin-bottom: 0; }
  #chicpage strong { font-weight: 700; }
  #chicpage em { font-style: italic; }
  #chicpage a { text-decoration: none; }
  #chicpage hr { border: none; margin: 2.8em 0; opacity: 0.9; }
  #chicpage img { max-width: 100%; height: auto; display: block; margin: 1.5em auto;  }
  #chicpage .table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 1.6em 0;
    max-width: 100%;
  }
  #chicpage .table-scroll table {
    width: max-content;
    min-width: 100%;
    margin: 0;
  }
  #chicpage table { width: 100%; border-collapse: collapse; margin: 1.6em 0; font-size: 0.94em; }
  #chicpage th { font-weight: 700; padding: 11px 14px; text-align: left; white-space: nowrap; }
  #chicpage td { padding: 5px 14px; white-space: nowrap; }
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

const WARM_PAPER_CODE_CSS = `
  #chicpage .hljs { color: #4d4c48; }
  #chicpage .hljs-keyword,
  #chicpage .hljs-selector-tag,
  #chicpage .hljs-literal,
  #chicpage .hljs-title,
  #chicpage .hljs-section,
  #chicpage .hljs-doctag,
  #chicpage .hljs-type,
  #chicpage .hljs-name,
  #chicpage .hljs-strong { color: #8a5a22; }
  #chicpage .hljs-string,
  #chicpage .hljs-attr,
  #chicpage .hljs-template-tag,
  #chicpage .hljs-template-variable,
  #chicpage .hljs-bullet { color: #6f6a35; }
  #chicpage .hljs-number,
  #chicpage .hljs-symbol,
  #chicpage .hljs-variable,
  #chicpage .hljs-params,
  #chicpage .hljs-link { color: #1b365d; }
  #chicpage .hljs-comment,
  #chicpage .hljs-quote { color: #8a8374; }
  #chicpage input[type="checkbox"] { accent-color: #1b365d; }
`;

const PAPER_INK_CODE_CSS = `
  #chicpage .hljs { color: #3f4650; }
  #chicpage .hljs-keyword,
  #chicpage .hljs-selector-tag,
  #chicpage .hljs-literal,
  #chicpage .hljs-title,
  #chicpage .hljs-section,
  #chicpage .hljs-doctag,
  #chicpage .hljs-type,
  #chicpage .hljs-name,
  #chicpage .hljs-strong { color: #354b68; }
  #chicpage .hljs-string,
  #chicpage .hljs-attr,
  #chicpage .hljs-template-tag,
  #chicpage .hljs-template-variable,
  #chicpage .hljs-bullet { color: #5d6a58; }
  #chicpage .hljs-number,
  #chicpage .hljs-symbol,
  #chicpage .hljs-variable,
  #chicpage .hljs-params,
  #chicpage .hljs-link { color: #6d5945; }
  #chicpage .hljs-comment,
  #chicpage .hljs-quote { color: #8a8176; }
  #chicpage input[type="checkbox"] { accent-color: #354b68; }
`;

const MAGAZINE_CODE_CSS = `
  #chicpage .hljs { color: #f7f1e3; }
  #chicpage .hljs-keyword,
  #chicpage .hljs-selector-tag,
  #chicpage .hljs-literal,
  #chicpage .hljs-title,
  #chicpage .hljs-section,
  #chicpage .hljs-doctag,
  #chicpage .hljs-type,
  #chicpage .hljs-name,
  #chicpage .hljs-strong { color: #d7bd82; }
  #chicpage .hljs-string,
  #chicpage .hljs-attr,
  #chicpage .hljs-template-tag,
  #chicpage .hljs-template-variable,
  #chicpage .hljs-bullet { color: #c9a86b; }
  #chicpage .hljs-number,
  #chicpage .hljs-symbol,
  #chicpage .hljs-variable,
  #chicpage .hljs-params,
  #chicpage .hljs-link { color: #ead9ad; }
  #chicpage .hljs-comment,
  #chicpage .hljs-quote { color: #a69a86; }
  #chicpage input[type="checkbox"] { accent-color: #111111; }
`;

const SKETCH_CODE_CSS = `
  #chicpage .hljs { color: #3a352f; }
  #chicpage .hljs-keyword,
  #chicpage .hljs-selector-tag,
  #chicpage .hljs-literal,
  #chicpage .hljs-title,
  #chicpage .hljs-section,
  #chicpage .hljs-doctag,
  #chicpage .hljs-type,
  #chicpage .hljs-name,
  #chicpage .hljs-strong { color: #5e5245; }
  #chicpage .hljs-string,
  #chicpage .hljs-attr,
  #chicpage .hljs-template-tag,
  #chicpage .hljs-template-variable,
  #chicpage .hljs-bullet { color: #75663f; }
  #chicpage .hljs-number,
  #chicpage .hljs-symbol,
  #chicpage .hljs-variable,
  #chicpage .hljs-params,
  #chicpage .hljs-link { color: #8a704a; }
  #chicpage .hljs-comment,
  #chicpage .hljs-quote { color: #8a8174; }
  #chicpage input[type="checkbox"] { accent-color: #5e5245; }
`;

export const WECHAT_THEMES: WechatTheme[] = [
  {
    id: 'default',
    name: '极简',
    description: '极简清爽 · 干净浅白',
    containerStyle: 'max-width:677px;margin:0 auto;color:#4a4a4a;font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background-color:#ffffff;',
    css: BASE_CSS + `
      #chicpage {
        color: #4a4a4a;
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        background: transparent;
        line-height: 1.95;
        letter-spacing: 0.01em;
        padding-top: 12px;
        padding-bottom: 36px;
      }
      #chicpage h1 {
        color: #2b2b2b;
        font-size: 26px;
        font-weight: 600;
        line-height: 1.35;
        letter-spacing: 0.02em;
        margin: 0.4em 0 1.1em;
      }
      #chicpage h2 {
        color: #2f2f2f;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        letter-spacing: 0.03em;
        margin: 2.4em 0 0.85em;
        padding-bottom: 0;
        border: none;
        border-bottom: none;
      }
      #chicpage h3 {
        color: #333;
        font-size: 17px;
        font-weight: 600;
        line-height: 1.45;
        margin: 1.8em 0 0.6em;
      }
      #chicpage h4, #chicpage h5, #chicpage h6 {
        color: #555;
        font-size: 16px;
        font-weight: 600;
        margin: 1.4em 0 0.5em;
      }
      #chicpage p {
        color: #5a5a5a;
        font-size: 16px;
        line-height: 2;
        margin: 1.15em 0;
      }
      #chicpage strong {
        font-weight: 600;
        color: #2b2b2b;
      }
      #chicpage em {
        font-style: normal;
        color: #8a8a8a;
      }
      #chicpage a {
        color: #6b8f7e;
        text-decoration: none;
        border-bottom: 1px solid rgba(107, 143, 126, 0.35);
      }
      #chicpage blockquote {
        margin: 1.8em 0;
        padding: 1em 1em;
        background: #f5f5f7;
        border: none;
        border-radius: 0;
        color: #5a5a5a;
        font-family: inherit;
        font-size: 15px;
        font-weight: 400;
        line-height: 2;
        letter-spacing: 0.01em;
        text-align: left;
      }
      #chicpage blockquote p {
        color: #5a5a5a;
        margin: 0.35em 0;
        text-align: left;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        letter-spacing: inherit;
      }
      #chicpage ul, #chicpage ol {
        margin: 1.1em 0;
        padding-left: 1.35em;
      }
      #chicpage ul { list-style-type: disc; }
      #chicpage ol { list-style-type: decimal; }
      #chicpage li {
        margin: 0.5em 0;
        color: #5a5a5a;
        line-height: 1.95;
        font-size: 15px;
      }
      #chicpage hr {
        border: none;
        height: 0;
        border-top: 1px solid #ececee;
        background: transparent;
        margin: 2.8em 0;
        opacity: 1;
      }
      #chicpage img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 2em auto;
        border: none;
        border-radius: 0;
        box-shadow: none;
        outline: none;
        background: transparent;
        filter: none;
        -webkit-filter: none;
        mix-blend-mode: normal;
        opacity: 1;
      }
      #chicpage code {
        background: #f5f5f5;
        color: #3a3a3a;
        border: none;
        border-radius: 0px;
        font-family: "SF Mono", Consolas, "Courier New", monospace;
      }
      #chicpage pre {
        background: #f7f7f7;
        border: none;
        border-radius: 0;
        box-shadow: none;
      }
      #chicpage pre code {
        color: #3a3a3a;
        background: transparent;
        border: none;
      }
      #chicpage .hljs { color: #3a3a3a; }
      #chicpage .hljs-keyword,
      #chicpage .hljs-selector-tag,
      #chicpage .hljs-literal,
      #chicpage .hljs-title,
      #chicpage .hljs-section,
      #chicpage .hljs-doctag,
      #chicpage .hljs-type,
      #chicpage .hljs-name,
      #chicpage .hljs-strong { color: #5f7d6e; font-weight: 600; }
      #chicpage .hljs-string,
      #chicpage .hljs-attr,
      #chicpage .hljs-template-tag,
      #chicpage .hljs-template-variable,
      #chicpage .hljs-bullet { color: #6b8f7e; }
      #chicpage .hljs-number,
      #chicpage .hljs-symbol,
      #chicpage .hljs-variable,
      #chicpage .hljs-params,
      #chicpage .hljs-link { color: #7a8a9a; }
      #chicpage .hljs-comment,
      #chicpage .hljs-quote { color: #9a9a9a; font-style: italic; }
      #chicpage .table-scroll {
        border: none;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        overflow: hidden;
      }
      #chicpage table {
        font-size: 14px;
        border: none;
      }
      #chicpage th {
        background: transparent;
        color: #2f2f2f;
        font-weight: 600;
        border: none;
        border-bottom: 1px solid #e8e8ea;
      }
      #chicpage td {
        border: none;
        border-bottom: 1px solid #f0f0f2;
        color: #5a5a5a;
      }
      #chicpage details {
        background: transparent;
        border: none;
        border-radius: 0;
        box-shadow: none;
      }
      #chicpage summary {
        font-weight: 600;
        color: #2f2f2f;
      }
      #chicpage details[open] summary {
        border-bottom: 1px solid #ececee;
      }
      #chicpage kbd {
        background: #fff;
        color: #4a4a4a;
        border: 1px solid #e0e1e3;
        border-bottom-width: 2px;
        border-radius: 6px;
      }
      #chicpage input[type="checkbox"] {
        accent-color: #6b8f7e;
      }
    `,
    preview: '#ffffff',
  },

  {
    id: 'receipt',
    name: '热敏',
    description: '热敏打印 · 黑白小票',
    containerStyle:
      'max-width:677px;margin:0 auto;color:#000000;font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background-color:#ffffff;',
    css: BASE_CSS + `
      #chicpage {
        color: #000000;
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        background: #ffffff;
        line-height: 1.55;
        letter-spacing: 0;
        padding: 16px 18px 32px;
        font-size: 15px;
      }
      #chicpage h1 {
        color: #000000;
        font-size: 28px;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.02em;
        margin: 8px 0 16px;
      }
      #chicpage h2 {
        color: #000000;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.35;
        letter-spacing: 0;
        margin: 32px 0 8px;
        padding: 0;
        border: none;
      }
      #chicpage h2::before {
        content: "★ ";
        font-weight: 700;
      }
      #chicpage h3 {
        color: #000000;
        font-size: 15px;
        font-weight: 700;
        line-height: 1.4;
        margin: 16px 0 8px;
      }
      #chicpage h3::before {
        content: "★ ";
        font-weight: 700;
      }
      #chicpage h4, #chicpage h5, #chicpage h6 {
        color: #000000;
        font-size: 14px;
        font-weight: 700;
        margin: 16px 0 8px;
        line-height: 1.4;
      }
      #chicpage p {
        color: #000000;
        font-size: 15px;
        line-height: 1.55;
        margin: 8px 0;
      }
      #chicpage strong {
        font-weight: 700;
        color: #000000;
      }
      #chicpage em {
        font-style: normal;
        color: #000000;
      }
      #chicpage a {
        color: #000000;
        text-decoration: underline;
        border-bottom: none;
      }
      #chicpage blockquote {
        margin: 16px 0;
        padding: 0;
        background: transparent;
        border: none;
        border-left: 2px solid #000000;
        border-radius: 0;
        color: #000000;
        font-size: 15px;
        font-weight: 400;
        line-height: 1.55;
        padding-left: 12px;
      }
      #chicpage blockquote p {
        color: #000000;
        margin: 4px 0;
        font-size: inherit;
        line-height: inherit;
      }
      #chicpage ul, #chicpage ol {
        margin: 8px 0;
        padding-left: 1.35em;
      }
      #chicpage ul { list-style-type: disc; }
      #chicpage ol { list-style-type: decimal; }
      #chicpage li {
        margin: 4px 0;
        color: #000000;
        line-height: 1.55;
        font-size: 15px;
      }
      #chicpage hr {
        border: none;
        height: 0;
        border-top: 1px dashed #000000;
        background: transparent;
        margin: 16px 0;
        opacity: 1;
      }
      #chicpage img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 16px auto;
        border: none;
        border-radius: 0;
        box-shadow: none;
        outline: none;
        background: transparent;
        filter: none;
        -webkit-filter: none;
        mix-blend-mode: normal;
        opacity: 1;
      }
      #chicpage code {
        background: transparent;
        color: #000000;
        border: 1px solid #000000;
        border-radius: 0;
        padding: 0.1em 0.35em;
        font-family: "SF Mono", Consolas, "Courier New", monospace;
      }
      #chicpage pre {
        background: #ffffff;
        border: 1px solid #000000;
        border-radius: 0;
        box-shadow: none;
        margin: 16px 0;
      }
      #chicpage pre code {
        color: #000000;
        background: transparent;
        border: none;
        padding: 12px;
      }
      #chicpage .hljs { color: #000000; }
      #chicpage .hljs-keyword,
      #chicpage .hljs-selector-tag,
      #chicpage .hljs-literal,
      #chicpage .hljs-title,
      #chicpage .hljs-section,
      #chicpage .hljs-doctag,
      #chicpage .hljs-type,
      #chicpage .hljs-name,
      #chicpage .hljs-strong { color: #000000; font-weight: 700; }
      #chicpage .hljs-string,
      #chicpage .hljs-attr,
      #chicpage .hljs-template-tag,
      #chicpage .hljs-template-variable,
      #chicpage .hljs-bullet { color: #222222; }
      #chicpage .hljs-number,
      #chicpage .hljs-symbol,
      #chicpage .hljs-variable,
      #chicpage .hljs-params,
      #chicpage .hljs-link { color: #111111; }
      #chicpage .hljs-comment,
      #chicpage .hljs-quote { color: #555555; font-style: italic; }
      #chicpage .table-scroll {
        border: none;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        overflow: hidden;
        margin: 16px 0;
      }
      #chicpage table {
        font-size: 14px;
        border: none;
      }
      #chicpage th {
        background: transparent;
        color: #000000;
        font-weight: 700;
        border: none;
        border-bottom: 1px dashed #000000;
        padding: 8px 10px;
      }
      #chicpage td {
        border: none;
        border-bottom: 1px dashed #cccccc;
        color: #000000;
        padding: 6px 10px;
      }
      #chicpage details {
        background: transparent;
        border: 1px solid #000000;
        border-radius: 0;
        box-shadow: none;
      }
      #chicpage summary {
        font-weight: 700;
        color: #000000;
      }
      #chicpage details[open] summary {
        border-bottom: 1px dashed #000000;
      }
      #chicpage kbd {
        background: #ffffff;
        color: #000000;
        border: 1px solid #000000;
        border-bottom-width: 2px;
        border-radius: 0;
      }
      #chicpage input[type="checkbox"] {
        accent-color: #000000;
      }
    `,
    preview: '#ffffff',
  },

  {
    id: '暖纸',
    name: '暖纸',
    description: '极简高对比排版',
    containerStyle: 'max-width:677px;margin:0 auto;color:#3d3d3a;font-family:"Source Han Sans","Inter","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background:#fdf6e6;',
    css: BASE_CSS + WARM_PAPER_CODE_CSS + `
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
      #chicpage h4 {
        color: #1d1c19;
        font-family: Georgia, "Noto Serif SC", "Songti SC", "TsangerJinKai02", serif;
        font-size: 17px;
        font-weight: 500;
        margin: 1.25em 0 0.5em;
        line-height: 1.3;
      }
      #chicpage h5 {
        color: #2a2926;
        font-family: Georgia, "Noto Serif SC", "Songti SC", "TsangerJinKai02", serif;
        font-size: 16px;
        font-weight: 500;
        margin: 1.15em 0 0.45em;
        line-height: 1.32;
      }
      #chicpage h6 {
        color: #5e5d59;
        font-size: 14px;
        font-weight: 600;
        margin: 1.1em 0 0.4em;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        line-height: 1.35;
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
      #chicpage .table-scroll {
        border: 1px solid #e6d5b3;
        border-radius: 16px;
      }
      #chicpage table {
        border: none;
        border-radius: 0;
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
    containerStyle: 'max-width:677px;margin:0 auto;color:#333;font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background-color:#ffffff;background-image:url("https://pub-165e4a840b054521b838c89222b94062.r2.dev/background/lined-paper-2.png");background-repeat:repeat;background-size:auto;',
    css: BASE_CSS + PAPER_INK_CODE_CSS + `
      #chicpage {
        color: #343230;
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
       
        }
      #chicpage h1 { color: #1f1d1a; font-size: 28px; font-weight: 700; margin: 1em 0 1em 0; }
      #chicpage h2 { color: #1f1d1a; font-size: 22px; font-weight: 600; margin: 1.2em 0 1em 0; }
      #chicpage h3 { color: #2a2825; font-size: 19px; font-weight: 600; margin: 1.2em 0 1em 0; }
      #chicpage h4 { color: #2a2825; font-size: 17px; font-weight: 600; margin: 1.1em 0 0.75em 0; }
      #chicpage h5 { color: #343230; font-size: 16px; font-weight: 600; margin: 1em 0 0.65em 0; }
      #chicpage h6 { color: #756c62; font-size: 14px; font-weight: 700; margin: 0.95em 0 0.55em 0; letter-spacing: 0.06em; text-transform: uppercase; }
      #chicpage p { font-size: 16px; margin: 1em 0; line-height: 1.8; color: #3f4650; }
      #chicpage blockquote { background: rgba(255, 252, 244, 0.72); color: #5b534b; padding: 1.2em 1.5em; }
      #chicpage li { margin: 0.6em 0; }
      #chicpage ul, #chicpage ol { margin: 1.2em 0; padding-left: 1em; }
      #chicpage ul { list-style-type: disc; }
      #chicpage ol { list-style-type: decimal; }
      #chicpage a { color: #354b68; text-decoration: underline; text-underline-offset: 4px; }
      #chicpage hr { border-top: 1px solid rgba(117, 108, 98, 0.22); margin: 3em 0; }
      #chicpage img { max-width: 100%; height: auto; display: block; margin: 1.5em auto; border-radius: 0px; }
      #chicpage blockquote { margin: 1.5em 0; padding: 12px 20px; font-style: normal; border-radius: 8px;border-left:0px}
    `,
    preview: '#ffffff',
  },
  {
    id: 'magazine',
    name: '杂志',
    description: '时尚杂志排版',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"Inter","PingFang SC",sans-serif;color:#181716;background-color:#ece7db;background-image:url("https://pub-165e4a840b054521b838c89222b94062.r2.dev/background/post.png");background-repeat:repeat;background-size:cover;background-position:center top;',
    css: BASE_CSS + MAGAZINE_CODE_CSS + `
      #chicpage { 
        color: #181716; 
        font-family: "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; 
        background-color: #ece7db;
        background-image:
          linear-gradient(180deg, rgba(245, 241, 231, 0.18) 0%, rgba(245, 241, 231, 0.1) 100%),
          url("https://pub-165e4a840b054521b838c89222b94062.r2.dev/background/post.png");
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

      #chicpage h2 {
        font-family: "Newsreader", "Noto Serif SC", Georgia, serif;
        font-size: 26px;
        font-weight: 600;
        color: #111111;
        margin: 2.2em 0 0.9em;
        letter-spacing: 0.04em;
        line-height: 1.2;
      }

      #chicpage h3 {
        font-family: "Newsreader", "Noto Serif SC", Georgia, serif;
        font-size: 20px;
        font-weight: 500;
        color: #1a1a1a;
        margin: 1.75em 0 0.65em;
        letter-spacing: 0.02em;
      }

      #chicpage h4 {
        font-family: "Newsreader", "Noto Serif SC", Georgia, serif;
        font-size: 17px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 1.5em 0 0.55em;
      }

      #chicpage h5 {
        font-family: "Newsreader", "Noto Serif SC", Georgia, serif;
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 1.4em 0 0.5em;
      }

      #chicpage h6 {
        font-family: "Newsreader", "Noto Serif SC", Georgia, serif;
        font-size: 15px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 1.3em 0 0.45em;
        text-transform: uppercase;
        letter-spacing: 0.08em;
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
    preview: 'url("https://pub-165e4a840b054521b838c89222b94062.r2.dev/background/post.png") center/cover no-repeat',
  },
  {
    id: 'sketch',
    name: '手绘',
    description: '克制手作纸感',
    containerStyle: 'max-width:677px;margin:0 auto;background-color:#fcfbf7;background-image:url("https://pub-165e4a840b054521b838c89222b94062.r2.dev/background/shohui.png");background-repeat:repeat;background-size:cover;background-position:center top;color:#2f2c28;font-family:"PingFang SC",sans-serif;',
    css: BASE_CSS + SKETCH_CODE_CSS + `
      #chicpage { 
        background-color: #fcfbf7;
        background-image: url("https://pub-165e4a840b054521b838c89222b94062.r2.dev/background/shohui.png");
        background-repeat: repeat;
        background-size: cover;
        background-position: center top;
        color: #2f2c28; 
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        line-height: 1.9; 
        padding: 2em 22px;
        letter-spacing: 0.01em;
      }

      #chicpage h1 {
        font-size: 30px;
        color: #1f1d1a;
        margin: 1em 0 0.95em;
        font-weight: 700;
      }

      #chicpage h2 {
        font-size: 20px;
        color: #2d2a25;
        display: inline-block;
        margin: 2.3em 0 1em;
        font-weight: 700;
        padding: 6px 16px 8px 14px;
        background: rgba(230, 200, 130, 0.32);
        border-radius: 2px 255px 5px 25px / 255px 5px 225px 5px;
        transform: rotate(-1.2deg);
      }

      /* H3：铅笔下划线感 */
      #chicpage h3 {
        font-size: 18px;
        color: #1f1d1a;
        margin: 1.7em 0 0.75em;
        display: inline-block;
        font-weight: 600;
      }
      #chicpage h4 {
        font-size: 17px;
        color: #1f1d1a;
        margin: 1.45em 0 0.6em;
        font-weight: 600;
      }
      #chicpage h5 {
        font-size: 16px;
        color: #2d2a25;
        margin: 1.3em 0 0.5em;
        font-weight: 600;
      }
      #chicpage h6 {
        font-size: 14px;
        color: #6e6254;
        margin: 1.15em 0 0.45em;
        font-weight: 700;
        letter-spacing: 0.06em;
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

      #chicpage img { 
        border-radius: 12px;
        margin: 2em auto;
      }
      
      #chicpage ul { list-style-type: disc; }
      #chicpage ol { list-style-type: decimal; }
      #chicpage li {
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
        color: #f8f0df;
        border-radius: 16px;
      }
    `,
    preview: 'url("https://pub-165e4a840b054521b838c89222b94062.r2.dev/background/shohui.png") center/cover no-repeat',
  }
];

export const getTheme = (id: string) =>
  WECHAT_THEMES.find(t => t.id === id) ?? WECHAT_THEMES[0];
