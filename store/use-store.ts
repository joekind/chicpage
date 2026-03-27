import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  markdown: string;
  html: string;
  imgRadius: number;
  previewMode: 'pc' | 'app' | 'xhs';
  styleTheme: 'wechat' | 'xhs';
  wechatTheme: string;
  xhsTheme: string;
  xhsFont: string;
  layoutMode: 'split' | 'edit' | 'preview';
  xhsShowHeader: boolean;
  xhsShowFooter: boolean;
  showWordCount: boolean;
  past: { markdown: string }[];
  future: { markdown: string }[];

  setMarkdown: (markdown: string | ((prev: string) => string)) => void;
  setHtml: (html: string) => void;
  setImgRadius: (radius: number) => void;
  setPreviewMode: (mode: 'pc' | 'app' | 'xhs') => void;
  setStyleTheme: (theme: 'wechat' | 'xhs') => void;
  setWechatTheme: (id: string) => void;
  setXHSTheme: (id: string) => void;
  setXHSFont: (id: string) => void;
  setLayoutMode: (mode: 'split' | 'edit' | 'preview') => void;
  setXHSShowHeader: (show: boolean) => void;
  setXHSShowFooter: (show: boolean) => void;
  setShowWordCount: (show: boolean) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

const INITIAL_MARKDOWN = `# ChicPage：极简排版工具

![ChicPage Banner](/4.png)

在这个快速传播的时代，我们希望帮助你更简单地进行文字表达。**ChicPage** 是一个简单的 Markdown 编辑器，专注于微信公众号和小红书的排版。

## 🖋️ 我们的想法

排版不应该成为创作的负担。我们通过直观的预览和预设的主题，让你能更专注于文字本身。

> “简单，是更高层次的精致。”

## ✨ 核心功能

- **实时预览**：在左侧输入，右侧即刻看到微信或小红书的排版效果。
- **预设主题**：内置了多款色调和谐的主题，支持一键切换。
- **便捷切图**：可以将内容一键转化为适合小红书展示的精美图片卡片。
- **无缝复制**：点击顶部「复制」按钮，样式将完整内联，直接粘贴到编辑器即可。

## 📸 排版演示

![ChicPage Demo](/1.png)

目前已有许多创作者在使用 ChicPage 记录生活和分享知识。

### 开始你的第一篇排版

在这里尝试修改文字，并在右侧切换不同的主题看一看效果吧。

---

*ChicPage，简化你的文字表达。*
`;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      markdown: INITIAL_MARKDOWN,
      html: "",
      imgRadius: 12,
      previewMode: 'app',
      styleTheme: 'wechat',
      wechatTheme: 'default',
      xhsTheme: 'pure-white',
      xhsFont: 'system',
      layoutMode: 'split',
      xhsShowHeader: true,
      xhsShowFooter: true,
      showWordCount: false,
      past: [],
      future: [],

      setMarkdown: (markdown) => set((state) => ({
        markdown: typeof markdown === 'function' ? markdown(state.markdown) : markdown,
      })),
      setHtml: (html) => set({ html }),
      setImgRadius: (imgRadius) => set({ imgRadius }),
      setPreviewMode: (previewMode) => set({ previewMode }),
      setStyleTheme: (styleTheme) => set({ styleTheme }),
      setXHSShowHeader: (xhsShowHeader) => set({ xhsShowHeader }),
      setXHSShowFooter: (xhsShowFooter) => set({ xhsShowFooter }),
      setShowWordCount: (showWordCount) => set({ showWordCount }),
      setWechatTheme: (wechatTheme) => set({ wechatTheme }),
      setXHSTheme: (xhsTheme) => set({ xhsTheme }),
      setXHSFont: (xhsFont) => set({ xhsFont }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),

      pushHistory: () => set((state) => ({
        past: [...state.past, { markdown: state.markdown }].slice(-50),
        future: []
      })),

      undo: () => set((state) => {
        if (state.past.length === 0) return state;
        const last = state.past[state.past.length - 1];
        return {
          markdown: last.markdown,
          past: state.past.slice(0, -1),
          future: [{ markdown: state.markdown }, ...state.future],
        };
      }),

      redo: () => set((state) => {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        return {
          markdown: next.markdown,
          past: [...state.past, { markdown: state.markdown }],
          future: state.future.slice(1),
        };
      }),
    }),
    {
      name: 'chicpage-storage',
      partialize: (state) => ({
        markdown: state.markdown,
        imgRadius: state.imgRadius,
        styleTheme: state.styleTheme,
        wechatTheme: state.wechatTheme,
        xhsTheme: state.xhsTheme,
        xhsFont: state.xhsFont,
        layoutMode: state.layoutMode,
        xhsShowHeader: state.xhsShowHeader,
        xhsShowFooter: state.xhsShowFooter,
        showWordCount: state.showWordCount,
      }),
    }
  )
);