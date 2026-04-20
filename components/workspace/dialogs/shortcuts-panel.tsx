"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, ChevronDown, ChevronUp } from "lucide-react";

interface Shortcut {
  key: string;
  desc: string;
  mac?: string;
  win?: string;
}

const shortcuts: Shortcut[] = [
  { key: "Cmd/Ctrl + S", mac: "⌘S", win: "Ctrl+S", desc: "复制富文本" },
  { key: "Cmd/Ctrl + Z", mac: "⌘Z", win: "Ctrl+Z", desc: "撤销" },
  { key: "Cmd/Ctrl + Shift + Z", mac: "⌘⇧Z", win: "Ctrl+Y", desc: "重做" },
  { key: "Cmd/Ctrl + B", mac: "⌘B", win: "Ctrl+B", desc: "加粗" },
  { key: "Cmd/Ctrl + I", mac: "⌘I", win: "Ctrl+I", desc: "斜体" },
  { key: "Cmd/Ctrl + K", mac: "⌘K", win: "Ctrl+K", desc: "插入链接" },
  { key: "Tab", desc: "缩进" },
  { key: "Shift + Tab", desc: "取消缩进" },
  { key: "Alt + Click", desc: "打开右键菜单" },
];

export const ShortcutsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMac] = useState(
    () => typeof navigator !== "undefined" && navigator.userAgent.includes("Mac"),
  );

  const getShortcutDisplay = (shortcut: Shortcut) => {
    if (isMac && shortcut.mac) return shortcut.mac;
    if (!isMac && shortcut.win) return shortcut.win;
    return shortcut.key;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-6 bottom-6 z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden w-72">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Keyboard className="size-4 text-zinc-400" />
                    <span className="text-sm font-bold text-zinc-900">快捷键</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {!isCollapsed && (
                  <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                    {shortcuts.map((shortcut, i) => (
                      <motion.div
                        key={shortcut.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-xs text-zinc-500 font-medium">{shortcut.desc}</span>
                        <span className="text-[11px] font-mono bg-zinc-100 px-2 py-1 rounded-md text-zinc-700 font-bold">
                          {getShortcutDisplay(shortcut)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="w-full py-4 border-t border-zinc-100 flex items-center justify-center gap-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {isCollapsed ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  {isCollapsed ? '展开' : '收起'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed left-6 bottom-6 bg-zinc-900 text-white p-3 rounded-full shadow-2xl hover:bg-zinc-800 transition-colors z-40"
        >
          <Keyboard className="size-5" />
        </motion.button>
      )}
    </>
  );
};
