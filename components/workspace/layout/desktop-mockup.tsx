"use client";

import React from "react";

export const DesktopMockup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative mx-auto w-full max-w-4xl min-w-[600px] overflow-hidden rounded-xl border border-zinc-200/80 bg-[rgba(250,250,251,0.9)] shadow-[0_22px_60px_rgba(90,70,45,0.08)] backdrop-blur-md">
      <div className="flex h-11 items-center gap-2 border-b border-zinc-200/70 bg-[rgba(247,247,248,0.92)] px-4">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400" />
          <div className="size-3 rounded-full bg-amber-400" />
          <div className="size-3 rounded-full bg-emerald-400" />
        </div>
        <div className="ml-4 flex h-7 flex-1 items-center rounded-md bg-[rgba(255,255,255,0.55)] px-3 text-[11px] text-zinc-400 shadow-sm">
          ChicPage
        </div>
      </div>
      <div className="h-[600px] overflow-y-auto bg-[rgba(248,248,249,0.88)] p-8">
        {children}
      </div>
    </div>
  );
};
