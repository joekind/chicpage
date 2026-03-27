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
  Download,
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

const Nav = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
      scrolled ? "pt-4" : "pt-0"
    )}>
      <div className={cn(
        "mx-auto max-w-screen-2xl h-[64px] flex items-center justify-between transition-all duration-500 px-8",
        scrolled ? "bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-full shadow-lg" : "bg-transparent border-b border-transparent"
      )}>
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-4 group">
            <img
              src="/wmremove-transformed.png"
              alt="ChicPage Logo"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-2xl font-black font-display tracking-tighter text-zinc-900 uppercase">
              ChicPage
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            <a href="#vision" className="hover:text-zinc-900 transition-colors uppercase">Vision</a>
            <a href="#lab" className="hover:text-zinc-900 transition-colors uppercase">Lab</a>
            <a href="#source" className="hover:text-zinc-900 transition-colors uppercase">Source</a>
          </div>
        </div>
        <Link href="/workspace">
          <Button className="h-10 bg-zinc-900 hover:bg-indigo-600 text-white font-mono text-[10px] uppercase tracking-[0.2em] px-6 rounded-full transition-all duration-500 shadow-md">
            Workspace
            <ArrowRight className="ml-2 size-3.5" />
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="min-h-screen mesh-bg text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <Nav />

      {/* Hero: Editorial Style */}
      <section className="relative pt-[140px] pb-[100px] px-6 overflow-hidden">
        <div className="mx-auto max-w-screen-2xl">
          <EditorialLine />

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-10"
              >
                <div className="h-[1px] w-12 bg-indigo-500" />
                <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-indigo-500/80 font-bold">
                  次世代排版引擎 // 版本 2.0.4
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-[100px] lg:text-[140px] xl:text-[160px] font-display font-black leading-[0.85] tracking-tighter uppercase"
              >
                让表达 <br />
                <span className="text-shimmer italic font-serif normal-case font-thin">无谓</span> <br />
                界限<span className="text-gradient">.</span>
              </motion.h1>
            </div>
            <div className="lg:col-span-4 pb-6">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl leading-relaxed italic font-serif text-zinc-500 max-w-sm mb-12"
              >
                “排版是文字的灵魂。ChicPage 为你的表达提供应有的舞台。”
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link href="/workspace">
                  <Button className="h-16 px-10 bg-zinc-900 text-white hover:bg-indigo-600 transition-all duration-500 text-sm font-bold tracking-widest uppercase group rounded-full floating-shadow">
                    立即开启创作
                    <ArrowRight className="ml-3 size-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-32 relative rounded-[32px] overflow-hidden floating-shadow group border border-white/50"
          >
            <motion.div
              style={{ scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.05]) }}
              className="w-full relative aspect-[16/9] lg:aspect-auto lg:h-[900px] overflow-hidden"
            >
              <img
                src="/mockup/6.png"
                alt="ChicPage Editor Preview"
                className="w-full h-full object-cover object-top transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/10 pointer-events-none" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-[400px] bg-indigo-500/10 blur-[120px] rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section: Swiss Grid Asymmetry */}
      <section id="vision" className="py-32 px-6 relative bg-zinc-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-[120px] -rotate-12 translate-x-1/2 pointer-events-none" />

        <div className="mx-auto max-w-screen-2xl relative">
          <div className="flex flex-col lg:flex-row gap-24 items-start">
            <div className="w-full lg:w-2/5 sticky top-32">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="inline-block px-4 py-1.5 rounded-full border border-zinc-800 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-8"
              >
                我们的愿景 // 01
              </motion.div>
              <h2 className="text-6xl lg:text-8xl font-display font-black leading-none uppercase mb-12">
                重塑 <br />
                数字 <br />
                <span className="text-indigo-500">表达.</span>
              </h2>
              <p className="text-zinc-500 text-xl leading-relaxed mb-16 max-w-md">
                我们相信优秀的内容不仅在于言辞，更在于其在屏幕上呈现的视觉张力。ChicPage 将复杂的排版技术化繁为简。
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "智能分页", icon: Zap },
                  { label: "动态排版", icon: Sparkles },
                  { label: "多端预览", icon: Layout },
                  { label: "矢量输出", icon: Download }
                ].map((item, idx) => (
                  <div key={item.label} className="group">
                    <div className="size-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-500">
                      <item.icon className="size-5 text-zinc-400 group-hover:text-white" />
                    </div>
                    <span className="text-zinc-300 font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "大师级微信主题",
                  desc: "行业级的排版控制。每一个字符、每一处间距，都经过精确的数学计算。",
                  icon: BookOpen,
                  color: "bg-emerald-500",
                  img: "/mockup/1.png"
                },
                {
                  title: "小红书海报引擎",
                  desc: "AI 驱动的一键切图算法。将文字自动转化为具有社交影响力的精美卡片。",
                  icon: Layout,
                  color: "bg-rose-500",
                  img: "/mockup/2.png"
                },
                {
                  title: "沉浸式写作空间",
                  desc: "不仅是编辑器，更是一个激发灵感的实验室。让你专注于每一行文字的温度。",
                  icon: Command,
                  color: "bg-indigo-500",
                  img: "/mockup/3.png"
                },
                {
                  title: "Bento 智能拼贴",
                  desc: "由实验室级别渲染引擎支持。自由拼贴、实时输出，探索排版的无限可能。",
                  icon: Sparkles,
                  color: "bg-amber-500",
                  img: "/mockup/4.png"
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-zinc-800/40 backdrop-blur-xl border border-zinc-800 p-10 rounded-[32px] hover:border-zinc-700 transition-all duration-500 flex flex-col justify-between aspect-[4/5] overflow-hidden relative"
                >
                  <div className="relative z-10">
                    <div className={cn("size-12 rounded-2xl flex items-center justify-center mb-8", feature.color)}>
                      <feature.icon className="size-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-zinc-500 leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </div>

                  <div className="mt-12 -mx-10 -mb-10 opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
                    <img src={feature.img} alt={feature.title} className="w-full h-auto grayscale group-hover:grayscale-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lab Quote Section */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative text-5xl md:text-8xl lg:text-[140px] font-display font-black uppercase leading-[0.85] tracking-tighter"
        >
          为数字 <br />
          时代的 <br />
          <span className="text-gradient italic font-serif normal-case font-thin">文艺复兴</span> 而生
        </motion.h2>

        <div className="mt-24 flex justify-center">
          <Link href="/workspace">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="size-48 rounded-full bg-zinc-900 flex items-center justify-center text-white font-mono text-[11px] uppercase tracking-[0.4em] font-black cursor-pointer shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10">立刻开始创作</span>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Join Community: Connect Style */}
      <section id="source" className="py-32 px-6 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="size-2 rounded-full bg-indigo-500" />
                <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-400">
                  开源社区 // 交流与支持
                </span>
              </motion.div>
              <h2 className="text-5xl lg:text-7xl font-display font-black uppercase leading-tight mb-10">
                与全球 <br />
                创作者同行<span className="text-indigo-600">.</span>
              </h2>
              <p className="text-zinc-500 text-xl leading-relaxed max-w-md mb-12">
                加入我们的开源社区，获取最新的排版主题、技术文档以及来自全球创作者的设计灵感。
              </p>
              <div className="flex flex-wrap gap-6">
                <Button variant="outline" className="h-16 px-10 rounded-full border-zinc-200 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all font-mono text-xs uppercase tracking-widest shadow-sm">
                  <Github className="mr-3 size-5" />
                  Star on Github
                </Button>
                <div className="flex -space-x-3 items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="size-10 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative bg-white p-12 rounded-[48px] shadow-premium border border-zinc-100"
              >
                <div className="flex justify-between items-center mb-10">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-zinc-200" />
                    <div className="size-2.5 rounded-full bg-zinc-200" />
                    <div className="size-2.5 rounded-full bg-zinc-200" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">WeChat Official Account</span>
                </div>

                <div className="relative group overflow-hidden rounded-2xl mb-10">
                  <img
                    src="/6.png"
                    alt="微信公众号"
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>

                <div className="text-center">
                  <p className="text-zinc-900 font-bold mb-2">扫描二维码</p>
                  <p className="text-zinc-500 text-sm">获取排版灵感与更新动态</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer: Tech Minimalist */}
      <footer className="py-20 px-6 border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-4 space-y-10">
              <div className="flex items-center gap-4">
                <img src="/wmremove-transformed.png" alt="Logo" className="h-8 w-auto object-contain" />
                <span className="font-display font-black uppercase text-2xl tracking-tighter">ChicPage</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                致力于探索数字排版的无限可能。为每一个值得被看见的表达，提供应有的视觉庄重感。
              </p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
                <div className="size-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors pointer-events-auto cursor-pointer">
                  <Github className="size-5" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { title: "实验室", links: ["排版主题", "卡片切图", "智能拼贴"] },
                { title: "资源", links: ["社区组件", "技术文档", "API 参考"] },
                { title: "公司", links: ["关于我们", "愿景计划", "加入设计室"] },
                { title: "法律", links: ["隐私权", "服务条款"] },
              ].map((group) => (
                <div key={group.title} className="space-y-6">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-black">{group.title}</h4>
                  <ul className="space-y-4">
                    {group.links.map(l => (
                      <li key={l}>
                        <a href="#" className="text-sm text-zinc-400 hover:text-indigo-600 transition-colors">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100">
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest leading-loose">
                  © 2024 ChicPage Labs. <br />
                  All rights reserved. <br />
                  Designed with passion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
