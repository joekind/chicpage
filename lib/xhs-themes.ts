export interface XHSTheme {
  id: string;
  name: string;
  preview: string;
  background: string;
  containerStyle: string;
  css: string;
}

const BASE_XHS_CSS = `
  #xhs-content { font-size: 15px; line-height: 1.9; word-break: break-word; padding: 0 16px; }
  #xhs-content h1 { font-size: 21px; font-weight: 700; margin: 0 0 0.6em; line-height: 1.3; }
  #xhs-content h2 { font-size: 16px; font-weight: 700; margin: 1.2em 0 0.5em; line-height: 1.4; }
  #xhs-content h3 { font-size: 15px; font-weight: 600; margin: 1em 0 0.4em; }
  #xhs-content p { margin: 0.6em 0; }
  #xhs-content ul, #xhs-content ol { padding-left: 1.5em; margin: 0.5em 0; }
  #xhs-content li { margin: 0.25em 0; line-height: 1.8; }
  #xhs-content blockquote { margin: 0.8em 0; padding: 10px 14px; border-radius: 6px; }
  #xhs-content blockquote p { margin: 0; }
  #xhs-content strong { font-weight: 700; }
  #xhs-content em { font-style: italic; }
  #xhs-content a { text-decoration: none; }
  #xhs-content hr { border: none; margin: 1.2em 0; }
  #xhs-content img { max-width: 100%; max-height: 400px; height: auto; display: block; margin: 0.8em auto; border-radius: 6px; object-fit: contain; }
  #xhs-content table { width: 100%; border-collapse: collapse; margin: 0.8em 0; font-size: 13px; }
  #xhs-content th { font-weight: 600; padding: 7px 10px; text-align: left; }
  #xhs-content td { padding: 7px 10px; }
  #xhs-content code { font-size: 85%; padding: 0.15em 0.4em; border-radius: 3px; font-family: Consolas, "Courier New", monospace; }
  #xhs-content pre { margin: 0.8em 0; border-radius: 6px; overflow: hidden; }
  #xhs-content pre code { display: block; padding: 1em; font-size: 12px; line-height: 1.6; }
`;

export const XHS_THEMES: XHSTheme[] = [
  {
    id: 'pure-white',
    name: '纯白',
    preview: '#ffffff',
    background: '#ffffff',
    containerStyle: 'width:100%;max-width:375px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;',
    css: BASE_XHS_CSS + `
      #xhs-content { color: #1a1a1a; }
      #xhs-content h1 { color: #111; }
      #xhs-content h2 { color: #111; border-bottom: 1.5px solid #e8e8e8; padding-bottom: 6px; }
      #xhs-content h3 { color: #222; }
      #xhs-content blockquote { background: #f7f7f7; border-left: 3px solid #d0d0d0; color: #555; }
      #xhs-content strong { color: #111; }
      #xhs-content a { color: #555; text-decoration: underline; }
      #xhs-content hr { height: 1px; background: #ebebeb; }
      #xhs-content th { background: #f5f5f5; border: 1px solid #e8e8e8; color: #111; }
      #xhs-content td { border: 1px solid #e8e8e8; color: #333; }
      #xhs-content code { background: #f5f5f5; color: #333; }
    `,
  },
  {
    id: 'warm-paper',
    name: '暖纸',
    preview: '#faf8f4',
    background: '#faf8f4',
    containerStyle: 'width:100%;max-width:375px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;',
    css: BASE_XHS_CSS + `
      #xhs-content { color: #2c2416; }
      #xhs-content h1 { color: #1a1208; }
      #xhs-content h2 { color: #1a1208; border-bottom: 1.5px solid #e0d8cc; padding-bottom: 6px; }
      #xhs-content h3 { color: #2c2416; }
      #xhs-content blockquote { background: #f2ede4; border-left: 3px solid #c8b89a; color: #5a4a35; }
      #xhs-content strong { color: #1a1208; }
      #xhs-content a { color: #7a6248; }
      #xhs-content hr { height: 1px; background: #e0d8cc; }
      #xhs-content th { background: #f0ebe0; border: 1px solid #ddd4c4; color: #1a1208; }
      #xhs-content td { border: 1px solid #ddd4c4; color: #2c2416; }
      #xhs-content code { background: #ede8de; color: #4a3828; }
    `,
  },
  {
    id: 'cool-gray',
    name: '冷灰',
    preview: '#f4f5f7',
    background: '#f4f5f7',
    containerStyle: 'width:100%;max-width:375px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;',
    css: BASE_XHS_CSS + `
      #xhs-content { color: #1c1e24; }
      #xhs-content h1 { color: #0d0f14; }
      #xhs-content h2 { color: #0d0f14; border-bottom: 1.5px solid #dde0e8; padding-bottom: 6px; }
      #xhs-content h3 { color: #1c1e24; }
      #xhs-content blockquote { background: #eceef2; border-left: 3px solid #b0b8c8; color: #4a5060; }
      #xhs-content strong { color: #0d0f14; }
      #xhs-content a { color: #4a5570; }
      #xhs-content hr { height: 1px; background: #dde0e8; }
      #xhs-content th { background: #e8eaef; border: 1px solid #d8dce6; color: #0d0f14; }
      #xhs-content td { border: 1px solid #d8dce6; color: #1c1e24; }
      #xhs-content code { background: #e4e6ec; color: #2a3040; }
    `,
  },
  {
    id: 'ink-black',
    name: '墨黑',
    preview: '#141414',
    background: '#141414',
    containerStyle: 'width:100%;max-width:375px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;',
    css: BASE_XHS_CSS + `
      #xhs-content { color: #d8d8d8; }
      #xhs-content h1 { color: #f0f0f0; }
      #xhs-content h2 { color: #f0f0f0; border-bottom: 1.5px solid #2e2e2e; padding-bottom: 6px; }
      #xhs-content h3 { color: #e0e0e0; }
      #xhs-content blockquote { background: #1e1e1e; border-left: 3px solid #444; color: #aaa; }
      #xhs-content strong { color: #f0f0f0; }
      #xhs-content a { color: #aaa; }
      #xhs-content hr { height: 1px; background: #2e2e2e; }
      #xhs-content th { background: #1e1e1e; border: 1px solid #2e2e2e; color: #f0f0f0; }
      #xhs-content td { border: 1px solid #2e2e2e; color: #d8d8d8; }
      #xhs-content code { background: #1e1e1e; color: #c8c8c8; }
    `,
  },
  {
    id: 'sage-green',
    name: '鼠尾草',
    preview: '#f2f5f0',
    background: '#f2f5f0',
    containerStyle: 'width:100%;max-width:375px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;',
    css: BASE_XHS_CSS + `
      #xhs-content { color: #1e2820; }
      #xhs-content h1 { color: #111a12; }
      #xhs-content h2 { color: #111a12; border-bottom: 1.5px solid #ccd8c8; padding-bottom: 6px; }
      #xhs-content h3 { color: #1e2820; }
      #xhs-content blockquote { background: #e8ede5; border-left: 3px solid #9ab89a; color: #3a4e3c; }
      #xhs-content strong { color: #111a12; }
      #xhs-content a { color: #4a6e4c; }
      #xhs-content hr { height: 1px; background: #ccd8c8; }
      #xhs-content th { background: #e4ece0; border: 1px solid #c4d4c0; color: #111a12; }
      #xhs-content td { border: 1px solid #c4d4c0; color: #1e2820; }
      #xhs-content code { background: #e0e8dc; color: #2a3e2c; }
    `,
  },
  {
    id: 'dusty-blue',
    name: '雾蓝',
    preview: '#f0f3f8',
    background: '#f0f3f8',
    containerStyle: 'width:100%;max-width:375px;margin:0 auto;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;',
    css: BASE_XHS_CSS + `
      #xhs-content { color: #1a2030; }
      #xhs-content h1 { color: #0e1520; }
      #xhs-content h2 { color: #0e1520; border-bottom: 1.5px solid #c8d4e8; padding-bottom: 6px; }
      #xhs-content h3 { color: #1a2030; }
      #xhs-content blockquote { background: #e4eaf5; border-left: 3px solid #8aa4cc; color: #3a4a60; }
      #xhs-content strong { color: #0e1520; }
      #xhs-content a { color: #3a5a8a; }
      #xhs-content hr { height: 1px; background: #c8d4e8; }
      #xhs-content th { background: #e0e8f4; border: 1px solid #c0cce0; color: #0e1520; }
      #xhs-content td { border: 1px solid #c0cce0; color: #1a2030; }
      #xhs-content code { background: #dce4f0; color: #1a2a40; }
    `,
  },
];

export const getXHSTheme = (id: string) =>
  XHS_THEMES.find(t => t.id === id) ?? XHS_THEMES[0];
