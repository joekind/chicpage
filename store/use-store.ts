import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  markdown: string;
  references: string;
  html: string;
  imgRadius: number;
  previewMode: 'pc' | 'app' | 'xhs';
  styleTheme: 'wechat' | 'xhs';
  wechatTheme: string;
  layoutMode: 'split' | 'edit' | 'preview';
  past: { markdown: string, references: string }[];
  future: { markdown: string, references: string }[];

  setMarkdown: (markdown: string | ((prev: string) => string)) => void;
  setReferences: (refs: string | ((prev: string) => string)) => void;
  setHtml: (html: string) => void;
  setImgRadius: (radius: number) => void;
  setPreviewMode: (mode: 'pc' | 'app' | 'xhs') => void;
  setStyleTheme: (theme: 'wechat' | 'xhs') => void;
  setWechatTheme: (id: string) => void;
  setLayoutMode: (mode: 'split' | 'edit' | 'preview') => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

const INITIAL_MARKDOWN = `# ChicPage：让每一篇文章都值得被看见

![ChicPage Banner](https://pub-165e4a840b054521b838c89222b94062.r2.dev/uploads/1e695e0dc865fc06e5b872e59d95ce35.gif)

在这内容爆炸的时代，好的文字值得好的排版。**ChicPage** 是一款专为公众号创作者设计的 Markdown 编辑器，让你专注写作，一键生成精美排版。

## 为什么选择 ChicPage？

传统的公众号编辑器要么功能繁杂，要么排版单调。ChicPage 走了一条不同的路——

> 排版本身就是一种叙事。好的视觉节奏，能让读者在不知不觉中读完全文。

我们相信，创作者不应该把时间浪费在调字号、对齐格式上。

## 核心功能

- **Markdown 实时预览**：左边写，右边看，所见即所得
- **多套精美主题**：默认、绿意、典雅、科技、玫瑰，一键切换
- **一键复制到公众号**：样式完整内联，粘贴即用，无需二次调整
- **图片云端存储**：上传即永久保存，刷新不丢失
- **丰富的快捷工具**：加粗、引用、代码块、提示盒、表格……应有尽有

## 适合谁用？

![冬季小屋小镇](https://pub-165e4a840b054521b838c89222b94062.r2.dev/uploads/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E5%86%AC%E5%AD%A3-%E5%B0%8F%E5%B1%8B-%E5%B0%8F%E9%95%87.png)

1. 公众号作者，想要更高效的创作流程
2. 技术博主，需要代码高亮和规范排版
3. 内容运营，追求视觉一致性和品牌调性
4. 任何热爱写作、在意细节的人

## 开始使用

在左侧编辑器里写下你的内容，右侧实时预览效果。选择喜欢的主题，点击顶部「复制」按钮，直接粘贴到公众号编辑器即可。

:::tip
所有内容自动保存在本地，无需登录，随时可用。
:::

---

*ChicPage，让好内容被看见。*
`;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      markdown: INITIAL_MARKDOWN,
      references: "",
      html: "",
      imgRadius: 12,
      previewMode: 'app',
      styleTheme: 'wechat',
      wechatTheme: 'default',
      layoutMode: 'split',
      past: [],
      future: [],

      setMarkdown: (markdown) => set((state) => ({
        markdown: typeof markdown === 'function' ? markdown(state.markdown) : markdown,
      })),
      setReferences: (references) => set((state) => ({
        references: typeof references === 'function' ? references(state.references) : references,
      })),
      setHtml: (html) => set({ html }),
      setImgRadius: (imgRadius) => set({ imgRadius }),
      setPreviewMode: (previewMode) => set({ previewMode }),
      setStyleTheme: (styleTheme) => set({ styleTheme }),
      setWechatTheme: (wechatTheme) => set({ wechatTheme }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),

      pushHistory: () => set((state) => ({
        past: [...state.past, { markdown: state.markdown, references: state.references }].slice(-50),
        future: []
      })),

      undo: () => set((state) => {
        if (state.past.length === 0) return state;
        const last = state.past[state.past.length - 1];
        return {
          markdown: last.markdown,
          references: last.references,
          past: state.past.slice(0, -1),
          future: [{ markdown: state.markdown, references: state.references }, ...state.future],
        };
      }),

      redo: () => set((state) => {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        return {
          markdown: next.markdown,
          references: next.references,
          past: [...state.past, { markdown: state.markdown, references: state.references }],
          future: state.future.slice(1),
        };
      }),
    }),
    {
      name: 'chicpage-storage',
      partialize: (state) => ({
        markdown: state.markdown,
        references: state.references,
        imgRadius: state.imgRadius,
        styleTheme: state.styleTheme,
        wechatTheme: state.wechatTheme,
        layoutMode: state.layoutMode,
      }),
    }
  )
);