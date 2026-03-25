/**
 * ChicPage 公众号主题系统
 * 根选择器统一用 #chicpage，CSS 只写标签选择器，主题间只改颜色/字体差异
 */

export interface WechatTheme {
  id: string;
  name: string;
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
  #chicpage h1 { font-size: 22px; font-weight: 700; margin: 1.6em 0 0.8em; line-height: 1.3; }
  #chicpage h2 { font-size: 19px; font-weight: 700; margin: 1.4em 0 0.6em; line-height: 1.3; }
  #chicpage h3 { font-size: 16px; font-weight: 700; margin: 1.2em 0 0.5em; line-height: 1.3; }
  #chicpage h4, #chicpage h5, #chicpage h6 { font-size: 15px; font-weight: 700; margin: 1em 0 0.4em; }
  #chicpage p { margin: 0.9em 0; }
  #chicpage ul, #chicpage ol { padding-left: 2em; margin: 0.8em 0; }
  #chicpage li { margin: 0.4em 0; line-height: 1.75; }
  #chicpage blockquote { margin: 1.2em 0; padding: 12px 16px; font-style: normal; border-radius: 0 6px 6px 0; }
  #chicpage blockquote p { margin: 0; }
  #chicpage strong { font-weight: 700; }
  #chicpage em { font-style: italic; }
  #chicpage a { text-decoration: none; }
  #chicpage hr { border: none; margin: 2em 0; }
  #chicpage img { max-width: 100%; height: auto; display: block; margin: 1.5em auto; border-radius: 8px; }
  #chicpage table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 14px; }
  #chicpage th { font-weight: 700; padding: 8px 12px; text-align: left; }
  #chicpage td { padding: 8px 12px; }
  #chicpage code { font-size: 85%; padding: 0.2em 0.4em; border-radius: 3px; font-family: Consolas, "Courier New", monospace; }
  #chicpage pre { margin: 1.2em 0; border-radius: 8px; overflow: hidden; }
  #chicpage pre code { display: block; padding: 1em; font-size: 13px; line-height: 1.6; }
  #chicpage kbd { display: inline-block; padding: 2px 6px; font-size: 12px; font-family: Consolas, "Courier New", monospace; line-height: 1.4; color: #444; background: #f6f8fa; border: 1px solid #d0d7de; border-bottom-width: 2px; border-radius: 4px; }
  #chicpage input[type="checkbox"] { margin-right: 6px; accent-color: #6366f1; pointer-events: none; }
`;

export const WECHAT_THEMES: WechatTheme[] = [
  {
    id: 'default',
    name: '默认',
    containerStyle: 'max-width:677px;margin:0 auto;color:#333;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #chicpage { 
        color: #333; 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", Arial, sans-serif;
      }
      #chicpage h1 { color: #181832; padding-bottom: 0.4em; font-size: 28px; font-weight: 700; line-height: 1.2 !important; }
      #chicpage h2 { color: #181832; font-size: 22px; font-weight: 600; line-height: 1.5; margin: 2em 0 0.6em; }
      #chicpage h3 { color: #333; font-size: 18px; font-weight: 600; margin: 1.5em 0 0.5em; }
      #chicpage p { font-size: 16px; margin: 1.2em 0; line-height: 1.75; font-weight: 400; color: #444; }
      #chicpage img { border-radius: 12px; }
      #chicpage blockquote { background: #f8f9fa; border-left: 4px solid #dee2e6; color: #666; font-weight: 400; padding: 1em 1.2em; border-radius: 0 8px 8px 0; }
      #chicpage blockquote p { font-weight: 400; margin: 0; }
      #chicpage li::marker { color: #adb5bd; }
      #chicpage ul, #chicpage ol { margin: 1em 0; padding-left: 1.5em; }
      #chicpage strong { color: #111; }
      #chicpage a { color: #576b95; text-decoration: underline; text-underline-offset: 3px; }
      #chicpage hr { border-top: 1px solid #eee; margin: 2.5em 0; }
      #chicpage th { background: #f8f9fa; border-bottom: 2px solid #dee2e6; color: #333; }
      #chicpage td { border-bottom: 1px solid #eee; color: #555; }
      #chicpage pre { background: #f8f9fa; border: 1px solid #eee; }
      #chicpage pre code { padding: 1.2em; }
    `,
    preview: '#ffffff',
  },
  {
    id: 'elegant',
    name: '典雅',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:Georgia, "Source Serif 4", "Noto Serif SC", "STSong", "SimSun", serif;color:#2c2c2c;background:#fdfaf6;padding:32px 24px;',
    css: BASE_CSS + `
      #chicpage { color: #2c2c2c; font-family: Georgia, "Source Serif 4", "Noto Serif SC", "STSong", "SimSun", serif; line-height: 1.9; background: #fdfaf6; }

      /* 标题：居中 + 金色下划线装饰 */
      #chicpage h1 {
        color: #1a1a1a; text-align: center; font-size: 24px;
        font-weight: 400; letter-spacing: 0.15em;
        padding-bottom: 0.6em; margin-bottom: 0.4em;
        background: linear-gradient(to right, transparent 20%, #c8a96e 20%, #c8a96e 80%, transparent 80%) bottom / 100% 1px no-repeat;
      }
      /* H1 下方小装饰符 */
      #chicpage h1::after { content: '✦'; display: block; text-align: center; color: #c8a96e; font-size: 12px; margin-top: 8px; letter-spacing: 0.5em; }

      #chicpage h2 {
        color: #1a1a1a; font-size: 17px; font-weight: 600;
        letter-spacing: 0.08em;
        padding: 0 0 6px 0;
        border-bottom: 1px solid #e0cfa8;
        margin: 2em 0 0.8em;
      }
      #chicpage h2::before { content: '§ '; color: #c8a96e; font-weight: 400; }

      #chicpage h3 { color: #3a3a3a; font-size: 15px; font-weight: 600; margin: 1.5em 0 0.5em; }
      #chicpage h3::before { content: '◆ '; color: #c8a96e; font-size: 10px; vertical-align: middle; }

      /* 段落首行缩进 */
      #chicpage p { text-indent: 2em; margin: 0.6em 0; }

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
      #chicpage hr { border: none; margin: 2.5em 0; text-align: center; }
      #chicpage hr::after { content: '◇ ◆ ◇'; color: #c8a96e; font-size: 14px; letter-spacing: 0.4em; }

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
    containerStyle: 'max-width:677px;margin:0 auto;font-family:"Optima", "Inter", "PingFang SC", sans-serif;color:#1a1a1a;background:#fff;',
    css: BASE_CSS + `
      #chicpage { color: #1a1a1a; font-family: "Optima", "Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; background: #fff; line-height: 1.75; }

      /* H1：细字重居中，上下双线，大间距 */
      #chicpage h1 {
        font-size: 26px; font-weight: 200; text-align: center;
        letter-spacing: 0.4em; color: #1a1a1a;
        padding: 1em 0;
        border-top: 3px solid #1a1a1a;
        border-bottom: 1px solid #1a1a1a;
        margin: 1.5em 0 1.2em;
        line-height: 1.4;
      }

      /* H2：全大写黑底白字标签 */
      #chicpage h2 {
        display: inline-block;
        background: #1a1a1a; color: #fff;
        font-size: 11px; font-weight: 700;
        letter-spacing: 0.3em;
        padding: 5px 16px 4px;
        margin: 2em 0 1em;
        line-height: 1;
      }

      /* H3：数字序号感 */
      #chicpage h3 {
        font-size: 15px; font-weight: 700;
        color: #1a1a1a; margin: 1.6em 0 0.6em;
        padding-bottom: 4px;
        border-bottom: 1px dashed #ccc;
      }

      /* 引用：超大斜体居中，无边框 */
      #chicpage blockquote {
        margin: 2.5em 0; padding: 0 2em;
        border: none; background: transparent;
        text-align: center;
      }
      #chicpage blockquote p {
        font-size: 20px; font-style: italic;
        line-height: 1.6; color: #333;
        text-indent: 0; margin: 0;
      }
      #chicpage blockquote p::before { content: '\\201C'; }
      #chicpage blockquote p::after  { content: '\\201D'; }

      /* 首段首字下沉 */
      #chicpage p:first-of-type::first-letter {
        float: left; font-size: 3.6em; line-height: 0.75;
        margin: 0.08em 0.08em 0 0;
        font-weight: 900; color: #1a1a1a;
      }

      /* 分割线：点状居中 */
      #chicpage hr { border: none; margin: 3em 0; text-align: center; }
      #chicpage hr::after { content: '· · · · · ·'; color: #bbb; font-size: 20px; letter-spacing: 0.6em; }

      #chicpage strong { font-weight: 800; border-bottom: 2px solid #1a1a1a; padding-bottom: 1px; }
      #chicpage em { font-style: italic; color: #555; }
      #chicpage a { color: #1a1a1a; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
      #chicpage li::marker { color: #aaa; font-size: 0.8em; }

      /* 表格：无边框极简 */
      #chicpage th { background: transparent; border: none; border-bottom: 2px solid #1a1a1a; color: #1a1a1a; font-weight: 700; font-size: 11px; letter-spacing: 0.1em; padding: 8px 12px; }
      #chicpage td { border: none; border-bottom: 1px solid #eee; padding: 8px 12px; }
      #chicpage tr:nth-child(even) td { background: transparent; }

      #chicpage code { background: #f4f4f4; color: #1a1a1a; border: 1px solid #e8e8e8; font-size: 85%; }
      #chicpage pre code { background: #1e1e1e; color: #d4d4d4; border: none; }
    `,
    preview: '#ffffff',
  }
];

export const getTheme = (id: string) =>
  WECHAT_THEMES.find(t => t.id === id) ?? WECHAT_THEMES[0];
