import { WECHAT_THEMES } from "./themes";

export interface XHSTheme {
  id: string;
  name: string;
  preview: string;
  background: string;
  containerStyle: string;
  css: string;
}

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
