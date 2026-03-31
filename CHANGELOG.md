# 更新日志

## [未发布]

### 重大变更
- **重命名**: 将所有"小红书/XHS"相关命名改为"贴图/Poster"
  - `xhsTheme` → `posterTheme`
  - `xhsFont` → `posterFont`
  - `xhsShowHeader` → `posterShowHeader`
  - `xhsShowFooter` → `posterShowFooter`
  - `XHS_THEMES` → `POSTER_THEMES`
  - `XHS_FONTS` → `POSTER_FONTS`

### 新增
- 贴图模式预览（原小红书模式）
- PC端/移动端预览模式切换
- 主题选择器（微信主题/贴图主题）
- 字体选择器（贴图模式专用）

### 优化
- 修复切换到贴图模式时预览不更新的问题
- 统一类型定义到 `types/` 目录
- 提取业务逻辑到自定义 hooks
- 分页算法独立为 `lib/paging/` 模块

### 技术债务
- 创建统一类型定义文件
- 提取键盘快捷键逻辑到 `use-keyboard-shortcuts` hook
- 提取 Markdown 同步逻辑到 `use-markdown-sync` hook
- 提取编辑器历史记录到 `use-editor-history` hook
