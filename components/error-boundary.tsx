"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    // 重载页面以恢复干净状态
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 text-center">
            <div className="size-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="size-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-black text-zinc-900 mb-3">
              出错了
            </h1>

            <p className="text-zinc-500 mb-6 leading-relaxed">
              很抱歉，应用遇到了一个意外错误。这通常是由于临时问题导致的。
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors">
                  查看错误详情
                </summary>
                <pre className="mt-3 p-4 bg-zinc-50 rounded-xl text-xs text-red-600 overflow-auto max-h-32 border border-red-100">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <Button
              onClick={this.handleReset}
              className="w-full h-12 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl font-bold transition-all"
            >
              <RefreshCcw className="size-4 mr-2" />
              重新加载
            </Button>

            <p className="mt-6 text-xs text-zinc-300">
              如果问题持续存在，请尝试刷新页面或清除浏览器缓存
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
