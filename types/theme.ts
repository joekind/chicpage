/**
 * 主题相关类型定义
 */

/** 微信公众号主题接口 */
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

/** 贴图主题接口 */
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

/** 字体配置 */
export interface FontConfig {
  id: string;
  name: string;
  value: string;
}

/** 贴图比例 */
export type PosterRatio = '3:4' | '9:16' | '1:2';

/** 预览模式 */
export type PreviewMode = 'pc' | 'app';

/** 布局模式 */
export type LayoutMode = 'split' | 'edit' | 'preview';

/** 样式主题类型 */
export type StyleTheme = 'wechat' | 'poster';
