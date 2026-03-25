"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Layout,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  Github,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Components ---

const EditorialLine = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    transition={{ duration: 1.5, delay, ease: [0.19, 1, 0.22, 1] }}
    className="h-px w-full bg-zinc-900/10 origin-left"
  />
);

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 h-[80px] bg-[#fcfcfc]/80 backdrop-blur-md px-10 border-b border-zinc-900/5">
    <div className="mx-auto h-full flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-4 group">
          <img
            src="/wmremove-transformed.png"
            alt="ChicPage Logo"
            className="h-8 w-auto object-contain "
          />
          <span className="text-3xl font-black font-display tracking-tighter text-zinc-900 uppercase">
            ChicPage
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <a href="#vision" className="hover:text-zinc-900 transition-colors">01. 愿景</a>
          <a href="#lab" className="hover:text-zinc-900 transition-colors">02. 实验室</a>
          <a href="#source" className="hover:text-zinc-900 transition-colors">03. 开源</a>
        </div>
      </div>
      <Link href="/workspace">
        <Button className="h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-widest px-8 rounded-none">
          进入工作区
          <ArrowRight className="ml-3 size-4" />
        </Button>
      </Link>
    </div>
  </nav>
);

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <Nav />

      {/* Hero: Editorial Style */}
      <section className="relative pt-[200px] pb-[100px] px-10 overflow-hidden">
        <div className="mx-auto max-w-screen-2xl">
          <EditorialLine />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-400 mb-8 block"
              >
                次世代排版引擎 // 版本 2.0.4
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-8xl md:text-[160px] font-display font-black leading-[0.8] tracking-tighter uppercase"
              >
                设计 <br />
                <span className="text-zinc-300">无谓</span> <br />
                界限<span className="text-indigo-600">.</span>
              </motion.h1>
            </div>
            <div className="lg:col-span-4 pb-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl leading-relaxed italic font-serif text-zinc-500 max-w-sm"
              >
                “排版是文字的灵魂。ChicPage 为你的表达提供应有的舞台。”
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex gap-4 font-mono text-[10px] uppercase tracking-widest"
              >
                <div className="px-3 py-1 bg-zinc-100 border border-zinc-200">微信公众号</div>
                <div className="px-3 py-1 bg-zinc-100 border border-zinc-200">小红书</div>
                <div className="px-3 py-1 bg-zinc-900 text-white">智能贴图</div>
              </motion.div>
            </div>
          </div>

          <div className="mt-24 relative lg:h-[800px] overflow-hidden group">
            <motion.div
              style={{ scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.1]) }}
              className="w-full h-full bg-zinc-100 relative overflow-hidden"
            >
              <img
                src="/hero_mockup_editor.png"
                alt="预览"
                className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fcfcfc]" />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="size-[300px] border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <span className="text-white font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">沉浸式创作体验</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section: Swiss Grid Asymmetry */}
      <section id="vision" className="py-40 px-10 relative bg-zinc-900 text-white">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            <div className="w-full lg:w-1/3 sticky top-40">
              <h2 className="text-8xl font-display font-black leading-none uppercase mb-10">
                塑就 <br />
                未来 <br />
                表达<span className="text-indigo-500">_</span>
              </h2>
              <p className="text-zinc-500 text-lg leading-relaxed mb-12">
                我们相信优秀的内容不仅在于言辞，更在于其在屏幕上呈现的视觉张力。
              </p>
              <div className="flex flex-col gap-4">
                {["智能分页算法", "动态排版方案", "多端同步", "矢量导出"].map((t, idx) => (
                  <div key={t} className="flex items-center gap-4 group cursor-pointer">
                    <span className="text-zinc-700 font-mono text-sm">0{idx + 1}</span>
                    <span className="text-zinc-300 font-sans font-bold hover:translate-x-2 transition-transform">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
              <div className="bg-zinc-900 p-16 aspect-square flex flex-col justify-between border-r border-zinc-800">
                <div className="size-12 bg-white flex items-center justify-center">
                  <BookOpen className="size-6 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">大师级微信主题</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    行业级的排版控制。每一个字符、每一处间距，都经过精确的数学计算。
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900 p-16 aspect-square flex flex-col justify-between">
                <div className="size-12 bg-white flex items-center justify-center">
                  <Layout className="size-6 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">小红书卡片引擎</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    全球首创的 AI 驱动一键切图算法。将文字无缝转化为精美卡片。
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900 p-16 aspect-square flex flex-col justify-between border-r border-zinc-800">
                <div className="size-12 bg-white flex items-center justify-center">
                  <ImageIcon className="size-6 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">Bento 智能拼贴</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    在实验室级别的界面中自由拼贴海报。高保真渲染输出。
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900 p-16 aspect-square flex flex-col justify-center items-center">
                <div className="text-center group cursor-pointer">
                  <div className="size-16 rounded-full border border-zinc-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                    <ArrowRight className="size-6 text-zinc-500 group-hover:text-zinc-900" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">查看开发文档</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Quote Section */}
      <section className="py-60 px-10 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-9xl font-display font-black uppercase leading-[0.9] tracking-tighter"
        >
          为数字 <br />
          时代的 <br />
          <span className="italic font-serif normal-case font-thin text-zinc-300">文艺复兴</span> 而生
        </motion.h2>
        <div className="mt-20 flex justify-center">
          <Link href="/workspace">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="size-40 rounded-full bg-indigo-600 flex items-center justify-center text-white font-mono text-[10px] uppercase tracking-[0.3em] font-black cursor-pointer shadow-2xl"
            >
              立刻开始
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Footer: Tech Minimalist */}
      <footer className="py-12 px-10 border-t border-zinc-900/5 bg-[#fcfcfc]">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/wmremove-transformed.png" alt="Logo" className="h-7 w-auto object-contain [image-rendering:--webkit-optimize-contrast]" />
              <span className="font-display font-black uppercase text-xl">ChicPage</span>
            </div>
            <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
              设计系统 // 2024 发布
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-20">
            {[
              { title: "实验室", links: ["排版主题", "卡片切图", "智能拼贴"] },
              { title: "资源", links: ["Github", "文档", "Twitter"] },
              { title: "法律", links: ["隐私政策", "服务条款"] },
              { title: "动态", links: ["版本更新", "社区社区"] },
            ].map((group) => (
              <div key={group.title} className="space-y-6">
                <h4 className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-900 font-black">{group.title}</h4>
                <ul className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  {group.links.map(l => (
                    <li key={l}><a href="#" className="hover:text-zinc-900 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:w-[300px] font-mono text-[9px] uppercase tracking-widest text-zinc-300 leading-loose">
            ChicPage 是一个专注于排版、算法设计和社交媒体叙事交叉领域的科研项目。版权所有。
          </div>
        </div>
      </footer>
    </div>
  );
}
