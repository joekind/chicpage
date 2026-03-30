import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "ChicPage — 极简多端排版工具",
    template: "%s | ChicPage"
  },
  description: "让排版展现文字真正的张力。专为微信公众号、小红书、掘金、知乎设计的 Markdown 预览与全方位贴图工具。支持一键 MD 导入，快速生成优雅的长文与卡片。",
  keywords: ["ChicPage", "Markdown 排版", "公众号排版工具", "小红书切图", "Markdown 编辑器", "优雅排版", "掘金排版", "知乎排版", "社交媒体工具"],
  authors: [{ name: "ChicPage Labs" }],
  metadataBase: new URL("http://chicpage.quickext.com/"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "http://chicpage.quickext.com/",
    title: "ChicPage — 极致极简的多端排版生产力",
    description: "让你的文字散发优雅。专为创作者打造的 Markdown 排版与贴图引擎。",
    siteName: "ChicPage",
    images: [{
      url: "/mockup/banner-hero.png",
      width: 1200,
      height: 630,
      alt: "ChicPage Preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChicPage — 极简多端排版工具",
    description: "让每一行文字，都散发优雅。专为微信公众号、小红书设计的排版神器。",
    images: ["/mockup/banner-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="font-sans" suppressHydrationWarning>
      <head>
        <Script
          id="LA_COLLECT"
          src="//sdk.51.la/js-sdk-pro.min.js"
          strategy="afterInteractive"
          charSet="UTF-8"
        />
        <Script id="la-init" strategy="afterInteractive">
          {`LA.init({id:"3PStZ7PjRj3F8Csb",ck:"3PStZ7PjRj3F8Csb"})`}
        </Script>
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
