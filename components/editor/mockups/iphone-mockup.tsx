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

export { StatusBar };

export const IPhoneMockup = ({ children, mode }: { children: React.ReactNode; mode: string }) => {
  return (
    <div className="relative mx-auto overflow-hidden rounded-[55px] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl"
      style={{ width: 390, height: 800 }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-zinc-900" />
      {/* Screen */}
      <div className={cn("relative h-full w-full overflow-hidden rounded-[47px]", mode === "app" ? "bg-zinc-50" : "bg-white")}>
        <StatusBar />
        <div className="h-[calc(100%-40px)] overflow-y-auto no-scrollbar" style={{ padding: '8px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
