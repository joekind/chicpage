export interface XHSFont {
  id: string;
  name: string;
  value: string;
}

export const XHS_FONTS: XHSFont[] = [
  {
    id: 'system',
    name: '系统默认',
    value: 'system-ui, -apple-system, sans-serif',
  },
  {
    id: 'noto-sans',
    name: '思源黑体',
    value: '"Noto Sans SC", sans-serif',
  },
  {
    id: 'noto-serif',
    name: '思源宋体',
    value: '"Noto Serif SC", serif',
  },
  {
    id: 'lxgw',
    name: '霞鹜文楷',
    value: '"LXGW WenKai Lite", sans-serif',
  },
  {
    id: 'zcool-kuhei',
    name: '站酷酷黑',
    value: '"ZCOOL KuHei", sans-serif',
  },
  {
    id: 'zhimangxing',
    name: '智芒星',
    value: '"Zhi Mang Xing", cursive',
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    value: '"Open Sans", sans-serif',
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    value: '"JetBrains Mono", monospace',
  },
  {
    id: 'bebas-neue',
    name: 'Bebas Neue',
    value: '"Bebas Neue", sans-serif',
  }
];
