"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowRight, Smartphone, Monitor, Type, Download, Share2, FileJson, FileText, Github, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PageLoader = () => (
  <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Loader2 className="size-12 text-zinc-900" />
      </motion.div>
      <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">ChicPage</p>
    </motion.div>
  </div>
);

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-500",
      scrolled ? "bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 py-3" : "bg-transparent py-5"
    )}>
      <div className="mx-auto max-w-screen-xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/wmremove-transformed.png"
            alt="Logo"
            width={32}
            height={32}
            className="size-8 object-contain"
            priority
          />
          <span className="text-xl font-display font-black tracking-tighter text-zinc-900 uppercase">ChicPage</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/workspace">
            <Button variant="ghost" className="text-sm font-bold tracking-tight hover:bg-zinc-100 rounded-full px-6 transition-all duration-300">
              工作台
            </Button>
          </Link>
          <a
            href="https://github.com/joekind/chicpage"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <Github className="size-5" />
          </a>
          <Link href="/workspace">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-full px-6 h-10 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
              开始创作
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const ImageSkeleton = () => (
  <div className="w-full h-[560px] bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-[32px] animate-pulse">
    <div className="h-full flex items-center justify-center">
      <Loader2 className="size-8 text-zinc-300 animate-spin" />
    </div>
  </div>
);

export default function LandingPage() {
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({ hero: false, mobile: false });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setShowInitialLoader(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isLoading =
    showInitialLoader || !imagesLoaded.hero || !imagesLoaded.mobile;

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setShowScrollTop(latest > 500);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const features = [
    {
      title: "全方位贴图引擎",
      desc: "专为小红书、抖音、推特设计的语义级切图逻辑。",
      icon: <Share2 className="size-5" />,
      preview: (
        <div className="relative h-full py-4 flex items-center justify-center scroll-fade">
          <motion.div
            animate={{ rotate: [-10, -12, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 w-24 h-32 bg-white border border-zinc-100 rounded-xl shadow-lg"
          />
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="z-10 w-24 h-32 bg-zinc-900 rounded-xl shadow-2xl flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="size-4 bg-emerald-500 rounded-full"
            />
          </motion.div>
          <motion.div
            animate={{ rotate: [10, 12, 10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 w-24 h-32 bg-white border border-zinc-100 rounded-xl shadow-lg"
          />
        </div>
      )
    },
    {
      title: "全平台优雅排版",
      desc: "深度适配微信公众号、掘金、知乎、Twitter 等主流平台。",
      icon: <Smartphone className="size-5" />,
      preview: (
        <div className="flex items-center justify-center gap-4 h-full pt-4">
          <motion.div className="flex flex-col gap-2">
            {[
              { label: "微信公众号", bg: "bg-zinc-900", color: "text-white" },
              { label: "掘金 Juejin", bg: "bg-indigo-50", color: "text-indigo-600" },
              { label: "Twitter (X)", bg: "bg-zinc-100", color: "text-zinc-500" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, x: 5 }}
                className="px-3 py-1.5 rounded-lg cursor-pointer transition-all"
              >
                <div className={`${item.bg} ${item.color} text-[10px] font-bold`}>{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )
    },
    {
      title: "一键 MD 导入",
      desc: "支持本地 Markdown 文件直接导入，瞬间转化样式。",
      icon: <Download className="size-5" />,
      preview: (
        <div className="flex flex-col items-center justify-center gap-4 h-full">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              borderColor: ["rgb(229, 231, 235)", "rgb(203, 213, 225)", "rgb(229, 231, 235)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="size-16 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-200 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1, backgroundColor: "#f4f4f5" }}
          >
            <ArrowRight className="size-6 text-zinc-300 rotate-90" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] font-black text-zinc-300"
          >
            DROP FILE HERE
          </motion.p>
        </div>
      )
    },
    {
      title: "超多中文字体",
      desc: "书法、黑体、宋体，释放文字张力。",
      icon: <Type className="size-5" />,
      preview: (
        <div className="flex flex-col gap-3 py-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1, color: "#18181b" }}
            className="text-xl font-serif italic text-zinc-400 cursor-default"
          >
            思源宋体
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            className="text-xl font-black tracking-tighter text-zinc-900 cursor-default"
          >
            站酷酷黑
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1, color: "#18181b" }}
            className="text-xl font-sans font-medium text-zinc-300 cursor-default"
          >
            系统默认
          </motion.div>
        </div>
      )
    },
    {
      title: "多元导出能力",
      desc: "支持 HTML、MD 或图片压缩包。",
      icon: <Download className="size-5" />,
      preview: (
        <div className="flex flex-col gap-2 py-4">
          {[
            { label: "导出 HTML", icon: <FileJson className="size-4" />, color: "bg-emerald-50 text-emerald-600" },
            { label: "导出 Markdown", icon: <FileText className="size-4" />, color: "bg-indigo-50 text-indigo-600" },
            { label: "渲染为图片", icon: <Download className="size-4" />, color: "bg-zinc-50 text-zinc-600" }
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, x: 5 }}
              className={cn("flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-zinc-200 transition-all cursor-default font-bold text-xs uppercase tracking-tight", item.color)}
            >
              {item.icon}
              {item.label}
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "纯净编辑空间",
      desc: "沉浸式体验，让你专注于文字。",
      icon: <Monitor className="size-5" />,
      preview: (
        <motion.div
          className="h-full py-4 font-mono text-xs text-zinc-400 leading-6 border-l-2 border-indigo-500/30 pl-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            # ChicPage
          </motion.div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            专注于内容本身
          </motion.div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            --
          </motion.div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="bg-indigo-50 text-indigo-600 w-fit px-1 cursor-default"
          >
            让排版从此优雅
          </motion.div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-1"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="size-1.5 rounded-full bg-zinc-300"
            />
            <div className="h-1 w-8 bg-zinc-200 rounded" />
          </motion.div>
        </motion.div>
      )
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isLoading && <PageLoader />}
      </AnimatePresence>
      <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden">
        <Nav />

      {/* Hero Section */}
      <section className="relative pt-[180px] pb-[80px] px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-[#fafafa]" />

        <div className="mx-auto max-w-4xl space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-200"
          >
            <Sparkles className="size-3 text-zinc-400" />
            ChicPage v2.4.0 <ArrowRight className="size-3" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase"
          >
            可以让排版， <br />
            <span className="text-zinc-400">更加</span>优雅。
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-8"
          >
            <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed">
              专注于内容本身，<br />
              其他的繁复琐碎，交给 ChicPage 处理。
            </p>
            <div className="flex items-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/workspace">
                  <Button className="h-14 px-10 bg-zinc-900 text-white hover:bg-zinc-800 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                    进入工作台
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 mx-auto max-w-5xl"
        >
          {!imagesLoaded.hero && <ImageSkeleton />}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: imagesLoaded.hero ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[32px] overflow-hidden shadow-2xl border border-white relative"
            style={{ display: imagesLoaded.hero ? 'block' : 'none' }}
          >
            <Image
              src="/mockup/hero-pc-mockup.png"
              alt="Hero Mockup"
              width={1600}
              height={900}
              className="w-full h-auto"
              priority
              onLoad={() => setImagesLoaded(prev => ({ ...prev, hero: true }))}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Main Feature Bento Grid */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white border border-zinc-100 rounded-[32px] p-8 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full gap-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="size-10 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-500"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-black tracking-tight">{feature.title}</h3>
                  </div>
                  <p className="text-zinc-400 font-medium text-xs leading-normal">
                    {feature.desc}
                  </p>

                  <div className="mt-2 flex-1 min-h-[160px]">
                    {feature.preview}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section - Unified White Theme */}
      <section className="py-40 px-6 bg-white text-zinc-900 border-t border-zinc-100">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 space-y-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase"
              >
                现在，<br />
                开始重新 <br />
                定义你的<br />
                <span className="text-zinc-400">表达方式.</span>
              </motion.h2>
              <div className="flex flex-col gap-6">
                {[
                  "无需注册，开箱即用",
                  "完全私有化，内容不留存",
                  "极致优化，秒级响应"
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-zinc-500 font-bold"
                  >
                    <motion.div
                      whileHover={{ scale: 1.5, backgroundColor: "#18181b" }}
                      className="size-2 rounded-full bg-zinc-200 transition-colors"
                    />
                    {text}
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/workspace" className="inline-block">
                  <Button className="h-16 px-12 bg-zinc-900 text-white hover:bg-zinc-800 rounded-full text-lg font-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                    立即免费开始
                  </Button>
                </Link>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
              {!imagesLoaded.mobile && (
                <div className="w-full aspect-[2/3] bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-[40px] animate-pulse flex items-center justify-center">
                  <Loader2 className="size-8 text-zinc-300 animate-spin" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: imagesLoaded.mobile ? 1 : 0, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border border-zinc-100"
                style={{ display: imagesLoaded.mobile ? 'block' : 'none' }}
              >
                <Image
                  src="/mockup/hero-mobile-mockup.png"
                  alt="Mobile Mockup"
                  width={800}
                  height={1200}
                  className="w-full h-auto"
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, mobile: true }))}
                />
              </motion.div>
              <div className="absolute -inset-20 bg-zinc-100 blur-[120px] rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Ultra-Minimalist Footer */}
      <footer className="py-24 px-6 bg-[#fafafa] border-t border-zinc-100">
        <div className="mx-auto max-w-screen-xl flex flex-col md:flex-row justify-between items-center gap-16">

          <div className="space-y-8 max-w-sm">
            <motion.div whileHover={{ scale: 1.02 }} className="inline-block">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/wmremove-transformed.png"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
                <span className="text-lg font-display font-black tracking-tighter uppercase">ChicPage</span>
              </Link>
            </motion.div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <motion.div whileHover={{ y: -2 }}>
                <Link href="/workspace" className="hover:text-zinc-900 transition-colors underline underline-offset-4 decoration-zinc-200">工作台</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }}>
                <a href="https://github.com/joekind/chicpage" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 transition-colors underline underline-offset-4 decoration-zinc-200">GitHub 仓库</a>
              </motion.div>
            </div>
            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.4em]">
              © 2024 • DESIGNED IN BEIJING
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="w-80 h-auto flex justify-center items-center cursor-pointer"
          >
            <Image
              src="/6.png"
              alt="Scan to Learn More"
              width={320}
              height={224}
              className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
            />
          </motion.div>

        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-zinc-900 text-white p-3 rounded-full shadow-2xl hover:bg-zinc-800 transition-colors"
          >
            <ArrowRight className="size-5 rotate-[-90deg]" />
          </motion.button>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
