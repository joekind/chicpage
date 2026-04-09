# 更新日志

## [未发布]

### 新增
- 贴图新增 `3:4`、`9:16`、`1:2` 三种比例切换
- 顶部导航新增贴图比例切换控件
- 新增快捷键说明面板
- 首页新增加载动画、图片骨架屏和回到顶部按钮

### 优化
- 贴图预览与导出统一基于比例布局配置渲染
- 导出预览弹窗支持按当前贴图比例显示和抓取页面
- 编辑器快捷键逻辑提取到 [`use-keyboard-shortcuts`](hooks/use-keyboard-shortcuts.ts) Hook
- Markdown 同步渲染逻辑提取到 [`use-markdown-sync`](hooks/use-markdown-sync.ts) Hook
- 贴图预览容器样式升级，预览视觉更统一
- 首页交互动效与视觉表现增强

### 修复
- 修复 Markdown 异步渲染过程中可能产生的竞态更新问题
- 修复贴图模式下仍可切换不适用预览模式的交互问题
- 修复撤销/重做后编辑器内容同步不稳定的问题

### 重构
- 编辑器页面进一步拆分业务逻辑，降低 [`app/workspace/page.tsx`](app/workspace/page.tsx) 耦合度
- Store 新增 `posterRatio` 状态并收敛贴图预览模式类型定义

### 历史记录
- **重命名**: 将所有"小红书/XHS"相关命名改为"贴图/Poster"
  - `xhsTheme` → `posterTheme`
  - `xhsFont` → `posterFont`
  - `xhsShowHeader` → `posterShowHeader`
  - `xhsShowFooter` → `posterShowFooter`
  - `XHS_THEMES` → `POSTER_THEMES`
  - `XHS_FONTS` → `POSTER_FONTS`
- 贴图模式预览（原小红书模式）
- PC端/移动端预览模式切换
- 主题选择器（微信主题/贴图主题）
- 字体选择器（贴图模式专用）
- 修复切换到贴图模式时预览不更新的问题
- 统一类型定义到 `types/` 目录
- 提取业务逻辑到自定义 hooks
- 分页算法独立为 `lib/paging/` 模块
- 创建统一类型定义文件
- 提取键盘快捷键逻辑到 `use-keyboard-shortcuts` hook
- 提取 Markdown 同步逻辑到 `use-markdown-sync` hook
- 提取编辑器历史记录到 `use-editor-history` hook
