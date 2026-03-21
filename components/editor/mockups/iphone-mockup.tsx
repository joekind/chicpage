"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const IPhoneMockup = ({ children, mode }: { children: React.ReactNode; mode: string }) => {
  return (
    <div className="relative mx-auto h-[712px] w-[350px] overflow-hidden rounded-[55px] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-zinc-900" />

      {/* Inner Screen */}
      <div className={cn(
        "relative h-full w-full overflow-hidden rounded-[47px] bg-white transition-all duration-500",
        mode === 'app' ? "bg-zinc-50" : "bg-white"
      )}>
        {/* Status Bar Mock */}
        <div className="flex h-10 w-full items-end justify-between px-8 text-[11px] font-bold text-zinc-900">
          <span>9:41</span>
          <div className="flex gap-1.5">
            <div className="h-3 w-4 rounded-sm border border-black/20" />
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100%-40px)] overflow-y-auto no-scrollbar pt-2 px-4">
          {children}
        </div>
      </div>
    </div>
  );
};
