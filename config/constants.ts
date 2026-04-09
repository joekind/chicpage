/**
 * 全局常量配置
 */

/**
 * 贴图卡片尺寸配置
 */
export const POSTER_CARD = {
  WIDTH: 336,
  HEIGHT: 448,
  STATUS_HEIGHT: 40,
  HEADER_HEIGHT: 0,
  FOOTER_HEIGHT: 48,
  PADDING_X: 26,
  PADDING_Y: 32,
  SAFE_MARGIN: 20,
} as const;

/** 计算内容区域高度 */
export const POSTER_CONTENT_HEIGHT =
  POSTER_CARD.HEIGHT -
  POSTER_CARD.STATUS_HEIGHT -
  POSTER_CARD.HEADER_HEIGHT -
  POSTER_CARD.FOOTER_HEIGHT -
  POSTER_CARD.PADDING_Y * 2 -
  POSTER_CARD.SAFE_MARGIN;

/**
 * 导出配置
 */
export const EXPORT = {
  /** 默认导出图片缩放比例 */
  DEFAULT_SCALE: 3,
  /** 图片最大宽度 */
  IMAGE_MAX_WIDTH: 1920,
  /** 图片压缩质量 */
  IMAGE_QUALITY: 0.85,
  /** Markdown 渲染防抖时间 (ms) */
  MARKDOWN_DEBOUNCE_MS: 150,
  /** 历史记录防抖时间 (ms) */
  HISTORY_DEBOUNCE_MS: 800,
  /** 历史记录最大保存数量 */
  MAX_HISTORY_SIZE: 50,
  /** 图片预加载超时时间 (ms) */
  IMAGE_PRELOAD_TIMEOUT: 3000,
  /** 图片预加载并发限制 */
  IMAGE_PRELOAD_CONCURRENCY: 3,
} as const;

/**
 * 编辑器配置
 */
export const EDITOR = {
  /** 编辑器字体大小 */
  FONT_SIZE: '14px',
  /** 编辑器字体系列 */
  FONT_FAMILY: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
  /** 编辑器行高 */
  LINE_HEIGHT: 1.75,
  /** 代码字体 */
  CODE_FONT_FAMILY: 'Consolas, "Courier New", monospace',
} as const;

/**
 * IndexedDB 配置
 */
export const STORAGE = {
  /** 数据库名称 */
  DB_NAME: 'ChicPageDB',
  /** 存储名称 */
  STORE_NAME: 'images',
  /** 数据库版本 */
  DB_VERSION: 2,
} as const;

/**
 * UI 配置
 */
export const UI = {
  /** 动画持续时间 (ms) */
  ANIMATION_DURATION: 400,
  /** 滑动切换阈值 (px) */
  SWIPE_THRESHOLD: 50,
  /** 滑动阻尼系数 */
  SWIPE_DAMPING: 0.35,
} as const;

/**
 * 正则表达式
 */
export const REGEX = {
  /** 分页标记 */
  PAGEBREAK: /<!--\s*pagebreak\s*-->/gi,
  /** Base64 图片 */
  BASE64_IMAGE: /^data:image\//,
  /** 本地图片协议 */
  LOCAL_IMAGE: /^img:\/\//,
  /** Blob URL */
  BLOB_URL: /^blob:/,
} as const;
