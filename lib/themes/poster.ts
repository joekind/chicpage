import { WECHAT_THEMES } from "./wechat";

/**
 * 贴图主题接口
 */
export interface PosterTheme {
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

/**
 * 贴图主题列表
 * 基于微信主题转换而来
 */
export const POSTER_THEMES: PosterTheme[] = WECHAT_THEMES.map(theme => {
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

/**
 * 根据 ID 获取贴图主题
 */
export const getPosterTheme = (id: string) =>
  POSTER_THEMES.find(t => t.id === id) ?? POSTER_THEMES[0];

// 向后兼容的导出（使用 @deprecated 标记）
/**
 * @deprecated 使用 PosterTheme 代替
 */
export type XHSTheme = PosterTheme;

/**
 * @deprecated 使用 POSTER_THEMES 代替
 */
export const XHS_THEMES = POSTER_THEMES;

/**
 * @deprecated 使用 getPosterTheme 代替
 */
export const getXHSTheme = getPosterTheme;
