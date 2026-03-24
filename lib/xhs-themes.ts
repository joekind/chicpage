import { WECHAT_THEMES } from "./themes";

export interface XHSTheme {
  id: string;
  name: string;
  preview: string;
  background: string;
  containerStyle: string;
  css: string;
}

const BASE_XHS_CSS = `
  #chicpage, #chicpage * { box-sizing: border-box; }
  #chicpage { 
    font-size: 15px; 
    line-height: 1.9; 
    word-break: break-all; 
    overflow-wrap: anywhere; 
    padding: 40px 24px; 
    overflow-x: hidden;
    min-height: 100%;
  }
  #chicpage h1 { font-size: 21px; font-weight: 700; margin: 0 0 0.6em; line-height: 1.3; }
  #chicpage h2 { font-size: 16px; font-weight: 700; margin: 1.2em 0 0.5em; line-height: 1.4; }
  #chicpage h3 { font-size: 15px; font-weight: 600; margin: 1em 0 0.4em; }
  #chicpage p { margin: 0.6em 0; }
  #chicpage ul, #chicpage ol { padding-left: 1.5em; margin: 0.5em 0; }
  #chicpage li { margin: 0.25em 0; line-height: 1.8; }
  #chicpage blockquote { margin: 0.8em 0; padding: 10px 14px; border-radius: 6px; }
  #chicpage blockquote p { margin: 0; }
  #chicpage strong { font-weight: 700; }
  #chicpage em { font-style: italic; }
  #chicpage a { text-decoration: none; }
  #chicpage hr { border: none; margin: 1.2em 0; }
  #chicpage img { max-width: 100%; max-height: 400px; height: auto; display: block; margin: 0.8em auto; border-radius: 6px; object-fit: contain; }
  #chicpage table { width: 100%; border-collapse: collapse; margin: 0.8em 0; font-size: 13px; }
  #chicpage th { font-weight: 600; padding: 7px 10px; text-align: left; }
  #chicpage td { padding: 7px 10px; }
  #chicpage code { font-size: 85%; padding: 0.15em 0.4em; border-radius: 3px; font-family: Consolas, "Courier New", monospace; }
  #chicpage pre { margin: 0.8em 0; border-radius: 6px; overflow: hidden; }
  #chicpage pre code { display: block; padding: 1em; font-size: 12px; line-height: 1.6; }
`;

export const XHS_THEMES: XHSTheme[] = WECHAT_THEMES.map(theme => {
  const bgMatch = theme.containerStyle.match(/(?:background|background-color):\s*(#[a-fA-F0-9]{3,6}|[a-z]+)/);
  const background = bgMatch ? bgMatch[1] : '#ffffff';
  return {
    ...theme,
    background,
    preview: background,
    containerStyle: 'width:100%;min-height:100%;box-sizing:border-box;' + theme.containerStyle.replace(/margin:[^;]+;/g, '').replace(/max-width:[^;]+;/g, '').replace(/padding:[^;]+;/g, ''),
  };
});

export const getXHSTheme = (id: string) =>
  XHS_THEMES.find(t => t.id === id) ?? XHS_THEMES[0];
