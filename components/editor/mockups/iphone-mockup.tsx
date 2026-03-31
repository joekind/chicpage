"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function StatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const color = dark ? "#fff" : "#000";

  return (
    <div
      className="flex h-[42px] w-full items-center justify-between px-6 z-30 pointer-events-none"
      style={{
        fontSize: 12,
        fontWeight: "600",
        color,
        letterSpacing: '-0.1px'
      }}
    >
      {/* Time on the left */}
      <div className="flex-1 flex items-center">
        <span className="scale-[1.05]">{time}</span>
      </div>

      {/* Dynamic Island placeholder (space) */}
      <div className="w-[124px]" />

      {/* Icons on the right */}
      <div className="flex-1 flex items-center justify-end gap-1.5 translate-y-[0.5px]">
        {/* Signal bars */}
        <div className="flex items-end gap-[1.5px] h-[10.5px]">
          <div className="w-[3px] h-[35%] rounded-[0.8px]" style={{ background: color }} />
          <div className="w-[3px] h-[58%] rounded-[0.8px]" style={{ background: color }} />
          <div className="w-[3px] h-[80%] rounded-[0.8px]" style={{ background: color }} />
          <div className="w-[3px] h-[100%] rounded-[0.8px]" style={{ background: color, opacity: 0.3 }} />
        </div>

        {/* WiFi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path d="M8.5 10.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" fill={color} />
          <path d="M4.5 7.1a5.6 5.6 0 0 1 8 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M2.2 4.4a9.2 9.2 0 0 1 12.6 0" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
        </svg>

        {/* Battery */}
        <div className="flex items-center">
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            {/* Battery Body (Delicate border) */}
            <rect
              x="0.5"
              y="0.5"
              width="21"
              height="11"
              rx="3.5"
              stroke={color}
              strokeOpacity="0.3"
              strokeWidth="1.0"
            />
            {/* Battery Level (Balanced gap) */}
            <rect
              x="2.5"
              y="2.5"
              width="17"
              height="7"
              rx="1.2"
              fill={color}
            />
            {/* Battery Pole/Cap (Integrated shape) */}
            <path
              d="M23 4.2C23.8 4.2 24.5 4.8 24.5 6C24.5 7.2 23.8 7.8 23 7.8V4.2Z"
              fill={color}
              fillOpacity="0.4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export { StatusBar };

export interface IPhoneMockupProps {
  children: React.ReactNode;
  mode?: string;
  screenStyle?: React.CSSProperties;
  hideStatusBar?: boolean;
  /** 控制灵动岛是否显示，默认 true */
  showDynamicIsland?: boolean;
}

export const IPhoneMockup = ({
  children,
  mode,
  screenStyle,
  hideStatusBar = false,
  showDynamicIsland = true
}: IPhoneMockupProps) => {
  return (
    <div className="relative mx-auto transition-transform duration-500" style={{ width: 390, height: 790 }}>
      {/* Layered Shadows for Realism */}
      <div className="absolute inset-0 rounded-[58px] shadow-[0_20px_50px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.2)]" />

      {/* Outer Frame (Bezel) */}
      <div className="absolute inset-0 rounded-[58px] bg-[#1a1c1e] p-[3px] shadow-inner ring-1 ring-white/10 ring-inset overflow-visible">

        {/* Side Buttons - Left (Mute + Volume) */}
        <div className="absolute left-[-3px] top-[100px] w-[3px] h-[26px] bg-[#2d2f31] rounded-l-[2px] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)]" />
        <div className="absolute left-[-3px] top-[150px] w-[3px] h-[55px] bg-[#2d2f31] rounded-l-[2px] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)]" />
        <div className="absolute left-[-3px] top-[215px] w-[3px] h-[55px] bg-[#2d2f31] rounded-l-[2px] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)]" />

        {/* Side Button - Right (Power) */}
        <div className="absolute right-[-3px] top-[175px] w-[3px] h-[88px] bg-[#2d2f31] rounded-r-[2px] shadow-[inset_1px_0_1px_rgba(255,255,255,0.1)]" />

        {/* Inner Metal / Plastic Frame */}
        <div className="h-full w-full rounded-[55px] bg-[#000] p-[8px] pt-[12px] flex flex-col overflow-hidden relative border border-white/5 box-border">

          {!hideStatusBar && showDynamicIsland && (
            /* Dynamic Island (静态) */
            <div className="absolute top-[16px] left-1/2 -translate-x-1/2 z-[100] h-[34px] w-[120px] bg-[#000] rounded-[20px] flex items-center justify-between px-3">
              <div className="h-2 w-2 rounded-full bg-zinc-800/50" />
              <div className="h-2 w-8 rounded-full bg-zinc-800/20" />
            </div>
          )}

          {/* Actual Screen Container */}
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-[47px] transition-colors duration-500",
              !screenStyle?.background && (mode === "app" ? "bg-[#f8f9fa]" : "bg-white")
            )}
            style={screenStyle}
          >

            {/* Status Bar */}
            {!hideStatusBar && <StatusBar dark={false} />}

            {/* Content Area */}
            <div className={cn(
              "overflow-y-auto no-scrollbar relative",
              !hideStatusBar ? "h-[calc(100%-42px)]" : "h-full"
            )} style={{ padding: (hideStatusBar || mode === 'poster') ? '0' : '0 16px 40px', background: 'inherit' }}>
              {children}
            </div>

            {/* Bottom Indicator (Home Bar) */}
            <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 h-[5px] w-[130px] rounded-[100px] bg-black/20" />

            {/* Screen Inner Shadow/Glare (Subtle) */}
            <div className="absolute inset-0 pointer-events-none rounded-[47px] shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] border-[1.5px] border-black/5 ring-1 ring-white/10 ring-inset" />
          </div>
        </div>
      </div>
    </div>
  );
};
