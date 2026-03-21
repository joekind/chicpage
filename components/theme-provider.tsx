"use client";

import React, { useEffect } from "react";
import { useStore } from "@/store/use-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
  }, []);

  return <>{children}</>;
}
