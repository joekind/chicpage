import { WECHAT_THEMES } from "./themes";

export interface XHSTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  background: string;
  backgroundImage?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  containerStyle: string;
  css: string;
}

export const XHS_THEMES: XHSTheme[] = WECHAT_THEMES.map(theme => {
  const backgroundMatch = theme.containerStyle.match(/background-color:\s*([^;]+)/i)
    ?? theme.containerStyle.match(/background:\s*(#[a-fA-F0-9]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|[a-z]+)/i);
  const backgroundImageMatch = theme.containerStyle.match(/background-image:\s*([^;]+)/i);
  const backgroundRepeatMatch = theme.containerStyle.match(/background-repeat:\s*([^;]+)/i);
  const backgroundSizeMatch = theme.containerStyle.match(/background-size:\s*([^;]+)/i);
  const backgroundPositionMatch = theme.containerStyle.match(/background-position:\s*([^;]+)/i);

  const background = backgroundMatch ? backgroundMatch[1].trim() : '#ffffff';
  const backgroundImage = backgroundImageMatch?.[1].trim();
  const backgroundRepeat = backgroundRepeatMatch?.[1].trim() ?? (backgroundImage ? 'repeat' : undefined);
  const backgroundSize = backgroundSizeMatch?.[1].trim();
  const backgroundPosition = backgroundPositionMatch?.[1].trim() ?? (backgroundImage ? 'top left' : undefined);

  return {
    ...theme,
    background,
    backgroundImage,
    backgroundRepeat,
    backgroundSize,
    backgroundPosition,
    preview: background,
    containerStyle: 'width:100%;min-height:100%;box-sizing:border-box;' + theme.containerStyle.replace(/margin:[^;]+;/g, '').replace(/max-width:[^;]+;/g, '').replace(/padding:[^;]+;/g, ''),
  };
});

export const getXHSTheme = (id: string) =>
  XHS_THEMES.find(t => t.id === id) ?? XHS_THEMES[0];
