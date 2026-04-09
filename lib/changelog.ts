/**
 * 更新日志数据
 */

export interface ChangelogEntry {
  date: string;
  title: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-04-09',
    title: '贴图工作流与首页体验升级',
    items: [
      '贴图新增 3:4、9:16、1:2 三种比例切换',
      '预览与导出统一适配当前贴图比例',
      '新增快捷键说明面板，操作入口更直观',
      '首页新增加载动画、骨架屏与回到顶部交互',
    ],
  },
  {
    date: '2026-03-31',
    title: '主题系统全面升级',
    items: [
      '全新主题视觉设计，每个主题独具特色',
      '赤红：东方美学 + 宣纸纹理',
      '暗黑：极客美学 + 紫粉渐变光效',
      '新增更新日志时间轴功能',
    ],
  },
  {
    date: '初始版本',
    title: 'ChicPage 上线',
    items: [
      '微信公众号排版编辑',
      '贴图模式一键导出',
      '实时预览与主题切换',
      'Markdown 语法支持',
    ],
  },
];

/**
 * 获取最新的一条更新日志
 */
export const getLatestChangelog = (): ChangelogEntry => {
  return CHANGELOG[0];
};
