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
  #chicpage h1 { font-size: 24px; font-weight: 700; margin: 1.8em 0 1em; line-height: 1.3; }
  #chicpage h2 { font-size: 20px; font-weight: 700; margin: 1.8em 0 0.8em; line-height: 1.3; }
  #chicpage h3 { font-size: 18px; font-weight: 700; margin: 1.6em 0 0.6em; line-height: 1.3; }
  #chicpage h4, #chicpage h5, #chicpage h6 { font-size: 16px; font-weight: 700; margin: 1.4em 0 0.5em; }
  #chicpage p { margin: 1em 0; line-height: 1.75; }
  #chicpage ul, #chicpage ol { padding-left: 1.8em; margin: 1em 0; }
  #chicpage li { margin: 0.5em 0; line-height: 1.75; }
  #chicpage blockquote { margin: 1.5em 0; padding: 12px 20px; font-style: normal; border-radius: 0 8px 8px 0; }
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
    containerStyle: 'max-width:677px;margin:0 auto;color:#333;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;',
    css: BASE_CSS + `
      #chicpage { 
        color: #333; 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft Yahei", Arial, sans-serif;
      }
      #chicpage h1 { color: #111; padding-bottom: 0.4em; font-size: 28px; font-weight: 700; margin: 1.2em 0 0.8em; }
      #chicpage h2 { color: #111; font-size: 22px; font-weight: 600; margin: 2em 0 1em; border-bottom: 1px solid #f0f0f0; padding-bottom: 0.3em; }
      #chicpage h3 { color: #222; font-size: 19px; font-weight: 600; margin: 1.8em 0 0.8em; }
      #chicpage p { font-size: 16px; margin: 1em 0; line-height: 1.8; color: #374151; }
      #chicpage blockquote { background: #f9fafb; border-left: 4px solid #e5e7eb; color: #4b5563; padding: 1.2em 1.5em; }
      #chicpage ul, #chicpage ol { margin: 1.2em 0; }
      #chicpage li { margin: 0.6em 0; }
      #chicpage a { color: #2563eb; text-decoration: underline; text-underline-offset: 4px; }
      #chicpage hr { border-top: 1px solid #f3f4f6; margin: 3em 0; }
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
      #chicpage { 
        color: #1a1a1a; 
        font-family: "Optima", -apple-system, "Source Serif 4", "Noto Serif SC", serif; 
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

      /* 首段首字下沉 */
      #chicpage p:first-of-type::first-letter {
        float: left; font-size: 3.8em; line-height: 0.8;
        margin: 0.08em 0.1em 0 0;
        font-weight: 900; color: #000;
      }

      /* 分割线：极简长线 */
      #chicpage hr { border: none; border-top: 1px solid #1a1a1a; margin: 3.5em 10%; }

      /* 强调样式 */
      #chicpage strong { font-weight: 800; color: #000; background: linear-gradient(transparent 70%, #f0f0f0 70%); }
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
    id: 'shaoshupai',
    name: '少数派',
    containerStyle: 'max-width:677px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#444;background:#fff;',
    css: BASE_CSS + `
      #chicpage { color: #444; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.75; }
      #chicpage h1 { font-size: 26px; color: #222; text-align: center; border-bottom: 2px solid #e22d30; padding-bottom: 0.4em; margin: 1.5em 5% 1em; }
      #chicpage h2 { font-size: 20px; color: #222; border-left: 4px solid #e22d30; padding-left: 14px; margin: 2em 0 1em; }
      #chicpage h3 { font-size: 17px; color: #333; margin: 1.5em 0 0.8em; }
      #chicpage h3::before { content: ":: "; color: #e22d30; font-weight: 900; }
      #chicpage p { font-size: 15.5px; color: #555; margin: 1.1em 0; line-height: 1.8; }
      #chicpage blockquote { background: #f9f9f9; border-left: 4px solid #eee; color: #666; padding: 1.2em 1.5em; margin: 2em 0; }
      #chicpage blockquote p { margin: 0; font-size: 15px; }
      #chicpage a { color: #e22d30; border-bottom: 1px solid #e22d30; }
      #chicpage code { background: #fff5f5; color: #e22d30; border: 1px solid #fbdede; }
      #chicpage strong { color: #222; font-weight: 600; shadow: inset 0 -4px 0 #fff1f0; }
      #chicpage hr { border-top: 1px solid #eee; width: 60%; margin: 3em auto; }
    `,
    preview: '#e22d30',
  },
  {
    id: 'tech',
    name: '极客',
    containerStyle: 'max-width:677px;margin:0 auto;background:#1a1a2e;color:#e6e6e6;padding:24px;',
    css: BASE_CSS + `
      #chicpage { background: #1a1a2e; color: #e6e6e6; font-family: "Fira Code", "Consolas", monospace; padding: 2em 1.5em; line-height: 1.7; }
      #chicpage h1 { font-size: 24px; color: #4fc3f7; border-bottom: 1px solid #30363d; padding-bottom: 0.5em; font-family: monospace; }
      #chicpage h1::before { content: "> "; opacity: 0.5; }
      #chicpage h2 { font-size: 18px; color: #818cf8; margin-top: 2.2em; font-family: monospace; font-weight: 500; }
      #chicpage h2::after { content: " {"; opacity: 0.4; }
      #chicpage h3 { font-size: 16px; color: #c084fc; font-family: monospace; }
      #chicpage p { color: #abb2bf; margin: 1.2em 0; }
      #chicpage blockquote { background: #161b22; border-left: 4px solid #30363d; color: #8b949e; border-radius: 6px; }
      #chicpage code { background: #2d333b; color: #f87171; border-radius: 4px; border: 1px solid #444c56; }
      #chicpage pre { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; }
      #chicpage a { color: #58a6ff; text-decoration: underline; }
      #chicpage strong { color: #e6edf3; }
      #chicpage hr { border-top: 1px solid #30363d; }
    `,
    preview: '#1a1a2e',
  },
  {
    id: 'sketch',
    name: '手绘',
    containerStyle: 'max-width:677px;margin:0 auto;background:#fffef5;color:#333;padding:40px 30px;font-family: cursive, sans-serif;',
    css: BASE_CSS + `
      #chicpage { 
        background-color: #fffef5; 
        background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
        background-size: 24px 24px;
        color: #1a1a1a; 
        font-family:  "Avenir Next", "Hiragino Kaku Gothic Interface", "PingFang SC", cursive, sans-serif;
        line-height: 1.85; 
        padding: 2em 1em;
      }

      /* H1：紧凑的手绘涂鸦背景 */
      #chicpage h1 {
        font-size: 30px; color: #000; text-align: center;
        margin: 1.25em 0 1em; position: relative;
        padding: 10px 0;
        z-index: 1;
        display: inline-block;
        left: 50%;
        transform: translateX(-50%) rotate(-1deg);
      }
      #chicpage h1::before {
        content: ""; position: absolute; top: 15%; left: -5%; right: -5%; bottom: 15%;
        background: #fff;
        border: 2px solid #111;
        border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        z-index: -1;
        box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
      }
      #chicpage h1::after { 
        content: ""; position: absolute; bottom: 0; left: 10%; right: 10%; height: 4px; 
        background: #ff4757; opacity: 0.6; border-radius: 50%; 
      }

      /* H2：带涂鸦阴影的便签 */
      #chicpage h2 {
        font-size: 22px; color: #111; position: relative;
        display: inline-block; padding: 8px 20px;
        margin: 2.5em 0 1.2em;
        border: 2px solid #333;
        background: #ffeb3b;
        border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
        box-shadow: 6px 6px 0 #000;
        transform: rotate(2deg);
      }

      /* H3：彩色蜡笔波浪线下划线 */
      #chicpage h3 {
        font-size: 19px; color: #000; margin: 1.8em 0 0.8em;
        display: inline-block;
        border-bottom: 4px dotted #ff4081;
        transform: rotate(-1deg);
      }

      /* 引用：四角贴了透明胶带的纸片 */
      #chicpage blockquote {
        margin: 3.5em 0; padding: 2em;
        background: #fff; border: 1px solid #ddd;
        box-shadow: 5px 5px 15px rgba(0,0,0,0.05);
        position: relative;
        transform: rotate(-0.5deg);
      }
      /* 四角胶带 */
      #chicpage blockquote::before, #chicpage blockquote::after {
        content: ""; position: absolute; width: 50px; height: 20px;
        background: rgba(255, 255, 255, 0.5); border: 1px solid rgba(0,0,0,0.05);
        backdrop-filter: blur(1px); z-index: 2;
      }
      #chicpage blockquote::before { top: -10px; left: -15px; transform: rotate(-35deg); }
      #chicpage blockquote::after { bottom: -10px; right: -15px; transform: rotate(-35deg); }

      /* 强调样式：极其厚重的涂鸦高亮 */
      #chicpage strong { 
        font-weight: 900; color: #000; 
        background: #fff176;
        padding: 0 4px;
        border-radius: 20% 80% 30% 70% / 70% 30% 80% 20%;
        box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
      }
      #chicpage em { font-style: italic; color: #2196f3; font-weight: 800; border-bottom: 2px solid #2196f3; }
      #chicpage a { color: #f44336; border-bottom: 3px double #f44336; text-decoration: none; }

      /* 分割线：大手绘波浪线 */
      #chicpage hr { border: none; margin: 4em 0; background: none; height: 10px; position: relative; }
      #chicpage hr::after { 
        content: "〰〰〰〰〰〰〰〰〰"; font-size: 30px; color: #000;
        position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
        letter-spacing: -2px; width: 100%; text-align: center; opacity: 0.2;
      }

      /* 图片：像贴在墙上的照片 */
      #chicpage img { 
        padding: 12px; border: 1px solid #fff; background: #fff;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-radius: 2px;
        transform: rotate(1deg);
        margin: 2.5em auto;
      }
      
      #chicpage li { list-style: none; position: relative; padding-left: 25px; }
      #chicpage li::before { content: "✔"; position: absolute; left: 0; color: #4caf50; font-weight: 900; font-size: 1.2em; }
      
      #chicpage code { background: #e1f5fe; color: #0277bd; border: 1px dashed #0277bd; border-radius: 10px; }
      #chicpage pre { background: #1a1a1a; border: 3px solid #333; border-radius: 15px 50px 15px 50px; }
    `,
    preview: '#ffeb3b',
  }
];

export const getTheme = (id: string) =>
  WECHAT_THEMES.find(t => t.id === id) ?? WECHAT_THEMES[0];
