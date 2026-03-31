import { WECHAT_THEMES } from "./themes";

/**
 * 贴图主题接口
 */
export interface PosterTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  background: string;
  containerStyle: string;
  css: string;
}

/**
 * 贴图主题列表
 * 基于微信主题转换而来
 */
export const POSTER_THEMES: PosterTheme[] = WECHAT_THEMES.map(theme => {
  const bgMatch = theme.containerStyle.match(/(?:background|background-color):\s*(#[a-fA-F0-9]{3,6}|[a-z]+)/);
  const background = bgMatch ? bgMatch[1] : '#ffffff';
  return {
    ...theme,
    background,
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
