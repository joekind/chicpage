"use client";

import React from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  Heart,
  Star,
  MessageCircle
} from "lucide-react";

// 判断颜色是否为深色
function isColorDark(color: string): boolean {
  // 移除 # 号
  const hex = color.replace('#', '');
  
  // 转换为 RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // 计算亮度 (使用 YIQ 公式)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness < 128;
}

function StatusBar({ backgroundColor }: { backgroundColor: string }) {
  const isDark = isColorDark(backgroundColor);
  const color = isDark ? "#fff" : "#000";
  
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-10 w-full items-end justify-between px-6 pb-1" style={{ fontSize: 12, fontWeight: 700, color }}>
      <span>{time}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.8" fill={color} />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill={color} />
          <rect x="9" y="3" width="3" height="9" rx="0.8" fill={color} />
          <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill={color} opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 9.5z" fill={color} />
          <path d="M4.2 7.1a5.4 5.4 0 0 1 7.6 0" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M1.5 4.4a9 9 0 0 1 13 0" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
        {/* Battery */}
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={{ width: 22, height: 11, borderRadius: 3, border: `1.5px solid ${color}`, padding: 1.5, display: "flex", alignItems: "center" }}>
            <div style={{ width: "80%", height: "100%", borderRadius: 1.5, background: color }} />
          </div>
          <div style={{ width: 2, height: 5, borderRadius: 1, background: color, opacity: 0.4 }} />
        </div>
      </div>
    </div>
  );
}

export const XHSScreenMockup = ({ children, backgroundColor = "#ffffff" }: { children: React.ReactNode; backgroundColor?: string }) => {
  const isDark = isColorDark(backgroundColor);
  const textColor = isDark ? "#fff" : "#000";
  const iconColor = isDark ? "#fff" : "#000";
  
  return (
    <div className="relative mx-auto h-[712px] w-[350px] overflow-hidden rounded-[55px] border-[8px] border-zinc-900 shadow-2xl font-sans" style={{ backgroundColor }}>
      {/* Dynamic Notch */}
      <div className="absolute top-0 left-1/2 z-30 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />

      {/* Status Bar */}
      <div className="absolute top-0 w-full z-20">
        <StatusBar backgroundColor={backgroundColor} />
      </div>

      {/* XHS Note Header */}
      <div className="absolute top-10 w-full h-[78px] z-20 flex flex-col justify-end pb-2 px-4 shadow-sm" style={{ 
        backgroundColor, 
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` 
      }}>
        <div className="flex justify-between items-center w-full mb-1">
          <div className="flex items-center gap-1">
            <ChevronLeft className="size-6" style={{ color: iconColor }} />
            <div className="flex items-center gap-2 ml-1">
              <div className="size-8 rounded-full bg-zinc-100 border border-zinc-100 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chic" alt="avatar" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold leading-none" style={{ color: textColor }}>ChicPage 创作助手</span>
                <span className="text-[9px] mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>发布于北京</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-[11px] font-bold">
              关注
            </div>
            <MoreHorizontal className="size-5" style={{ color: iconColor }} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-full pt-[88px] pb-[68px] overflow-y-auto no-scrollbar scroll-smooth" style={{ backgroundColor }}>
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
        <div className="px-4 mt-4 text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
          编辑于 刚才 · 不允许二次转载
        </div>
        
        <div className="h-20" /> {/* Bottom spacing */}
      </div>

      {/* XHS Bottom Interaction Bar */}
      <div className="absolute bottom-0 w-full h-[68px] z-20 flex items-center px-4 pb-4 gap-4" style={{ 
        backgroundColor,
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` 
      }}>
        <div className="flex-1 h-9 rounded-full flex items-center px-4 gap-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
           <div className="size-4 rounded-full" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />
           <span className="text-[13px]" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>说点什么...</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
             <Heart className="size-5" style={{ color: iconColor }} />
             <span className="text-[10px] font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>9.9w</span>
          </div>
          <div className="flex flex-col items-center">
             <Star className="size-5" style={{ color: iconColor }} />
             <span className="text-[10px] font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>1.2w</span>
          </div>
          <div className="flex flex-col items-center">
             <MessageCircle className="size-5" style={{ color: iconColor }} />
             <span className="text-[10px] font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>3k</span>
          </div>
        </div>
      </div>
    </div>
  );
};
