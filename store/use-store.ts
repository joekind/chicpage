import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPosterTheme } from '@/lib/poster-themes';
import type { PosterRatio } from '@/types';

interface AppState {
  markdown: string;
  html: string;
  imgRadius: number;
  previewMode: 'pc' | 'app';
  styleTheme: 'wechat' | 'poster';
  wechatTheme: string;
  posterTheme: string;
  posterFont: string;
  posterRatio: PosterRatio;
  layoutMode: 'split' | 'edit' | 'preview';
  posterShowHeader: boolean;
  posterShowFooter: boolean;
  showWordCount: boolean;
  past: { markdown: string }[];
  future: { markdown: string }[];

  setMarkdown: (markdown: string | ((prev: string) => string)) => void;
  setHtml: (html: string) => void;
  setImgRadius: (radius: number) => void;
  setPreviewMode: (mode: 'pc' | 'app') => void;
  setStyleTheme: (theme: 'wechat' | 'poster') => void;
  setWechatTheme: (id: string) => void;
  setPosterTheme: (id: string) => void;
  setPosterFont: (id: string) => void;
  setPosterRatio: (ratio: PosterRatio) => void;
  setLayoutMode: (mode: 'split' | 'edit' | 'preview') => void;
  setPosterShowHeader: (show: boolean) => void;
  setPosterShowFooter: (show: boolean) => void;
  setShowWordCount: (show: boolean) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: (markdown?: string) => void;
}

const INITIAL_MARKDOWN = `# ChicPage：让每一篇文章都值得被看见

![ChicPage Banner](/4.png)

在这个快速传播的时代，我们希望帮助你更简单地进行文字表达。**ChicPage** 是一个简单的 Markdown 编辑器，专注于微信公众号和贴图的排版。

## 🖋️ 我们的想法

排版不应该成为创作的负担。我们通过直观的预览和预设的主题，让你能更专注于文字本身。

> "简单，是更高层次的精致。"

## ✨ 核心功能

- **实时预览**：在左侧输入，右侧即刻看到微信或贴图的排版效果。
- **预设主题**：内置了多款色调和谐的主题，支持一键切换。
- **便捷切图**：可以将内容一键转化为适合展示的精美图片卡片。
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
      posterTheme: 'pure-white',
      posterFont: 'system',
      posterRatio: '9:16',
      layoutMode: 'split',
      posterShowHeader: true,
      posterShowFooter: true,
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
      setPosterShowHeader: (posterShowHeader) => set({ posterShowHeader }),
      setPosterShowFooter: (posterShowFooter) => set({ posterShowFooter }),
      setShowWordCount: (showWordCount) => set({ showWordCount }),
      setWechatTheme: (wechatTheme) => set({ wechatTheme }),
      setPosterTheme: (posterTheme) => set({ posterTheme }),
      setPosterFont: (posterFont) => set({ posterFont }),
      setPosterRatio: (posterRatio) => set({ posterRatio }),
      setLayoutMode: (layoutMode) => set({ layoutMode }),

      pushHistory: (markdown) => set((state) => {
        const snapshot = markdown ?? state.markdown;
        const last = state.past[state.past.length - 1]?.markdown;
        if (snapshot === last) return state;

        return {
          past: [...state.past, { markdown: snapshot }].slice(-50),
          future: []
        };
      }),

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
        posterTheme: state.posterTheme,
        posterFont: state.posterFont,
        posterRatio: state.posterRatio,
        layoutMode: state.layoutMode,
        posterShowHeader: state.posterShowHeader,
        posterShowFooter: state.posterShowFooter,
        showWordCount: state.showWordCount,
      }),
    }
  )
);

// 向后兼容的导出
export const getXHSTheme = (id: string) => {
  console.warn('getXHSTheme is deprecated, use getPosterTheme instead');
  return getPosterTheme(id);
};
