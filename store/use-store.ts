import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPosterTheme } from '@/lib/themes';
import type { PosterRatio } from '@/types';
import INITIAL_MARKDOWN from '@/demos/typography-demo.md';

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
