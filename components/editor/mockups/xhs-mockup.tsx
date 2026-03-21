"use client";

import React from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  Heart,
  Star,
  MessageCircle
} from "lucide-react";

export const XHSScreenMockup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto h-[712px] w-[350px] overflow-hidden rounded-[55px] border-[8px] border-zinc-900 bg-white shadow-2xl font-sans">
      {/* Dynamic Notch */}
      <div className="absolute top-0 left-1/2 z-30 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />

      {/* XHS Note Header */}
      <div className="absolute top-0 w-full h-[88px] bg-white z-20 flex flex-col justify-end pb-2 px-4 shadow-sm border-b border-zinc-100">
        {/* Status bar space */}
        <div className="flex justify-between items-center w-full mb-1">
          <div className="flex items-center gap-1">
            <ChevronLeft className="size-6 text-zinc-900" />
            <div className="flex items-center gap-2 ml-1">
              <div className="size-8 rounded-full bg-zinc-100 border border-zinc-100 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chic" alt="avatar" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold leading-none">ChicPage 创作助手</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">发布于北京</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-[11px] font-bold">
              关注
            </div>
            <MoreHorizontal className="size-5 text-zinc-900" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full pt-[88px] pb-[68px] overflow-y-auto no-scrollbar scroll-smooth bg-white">
        {/* The Actual Content */}
        <div className="px-0">
          {children}
        </div>
        
        {/* XHS Tags & Time Mockup */}
        <div className="px-4 mt-6 flex flex-wrap gap-2">
          <span className="text-[#3b82f6] text-[13px]">#自媒体干货</span>
          <span className="text-[#3b82f6] text-[13px]">#高效排版</span>
          <span className="text-[#3b82f6] text-[13px]">#ChicPage</span>
        </div>
        <div className="px-4 mt-4 text-[11px] text-zinc-400">
          编辑于 刚才 · 不允许二次转载
        </div>
        
        <div className="h-20" /> {/* Bottom spacing */}
      </div>

      {/* XHS Bottom Interaction Bar */}
      <div className="absolute bottom-0 w-full h-[68px] bg-white border-t border-zinc-100 z-20 flex items-center px-4 pb-4 gap-4">
        <div className="flex-1 h-9 rounded-full bg-zinc-100 flex items-center px-4 gap-2">
           <div className="size-4 rounded-full bg-zinc-300" />
           <span className="text-zinc-400 text-[13px]">说点什么...</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
             <Heart className="size-5 text-zinc-800" />
             <span className="text-[10px] text-zinc-500 font-medium">9.9w</span>
          </div>
          <div className="flex flex-col items-center">
             <Star className="size-5 text-zinc-800" />
             <span className="text-[10px] text-zinc-500 font-medium">1.2w</span>
          </div>
          <div className="flex flex-col items-center">
             <MessageCircle className="size-5 text-zinc-800" />
             <span className="text-[10px] text-zinc-500 font-medium">3k</span>
          </div>
        </div>
      </div>
    </div>
  );
};
