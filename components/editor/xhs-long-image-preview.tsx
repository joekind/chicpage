"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { XHSTheme } from "@/lib/xhs-themes";

interface XHSLongImagePreviewProps {
  html: string;
  theme: XHSTheme;
  authorName?: string;
  authorAvatar?: string;
  tags?: string[];
  showHeader?: boolean;
  showFooter?: boolean;
}

export const XHSLongImagePreview = forwardRef<HTMLDivElement, XHSLongImagePreviewProps>(
  ({ 
    html, 
    theme, 
    authorName = "ChicPage 创作助手",
    authorAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Chic",
    tags = ["自媒体干货", "高效排版", "ChicPage"],
    showHeader = true,
    showFooter = true
  }, ref) => {
    return (
      <div 
        ref={ref}
        className="xhs-long-image"
        style={{
          background: theme.background,
          minHeight: '100%',
          width: '375px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <style>{`
          ${theme.css}
          .xhs-header {
            padding: 24px 24px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .xhs-header-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .xhs-header-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .xhs-header-info {
            flex: 1;
          }
          .xhs-header-name {
            font-size: 14px;
            font-weight: 700;
            color: inherit;
          }
          .xhs-header-badge {
            font-size: 10px;
            color: rgba(0, 0, 0, 0.5);
            margin-top: 2px;
          }
          .xhs-content-wrapper {
            padding: 0 24px;
            width: 100%;
            max-width: 375px;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
          }
          .xhs-footer {
            padding: 20px 24px 32px;
          }
          .xhs-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;
          }
          .xhs-tag {
            font-size: 12px;
            color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
            padding: 4px 10px;
            border-radius: 12px;
          }
          .xhs-meta {
            font-size: 11px;
            color: rgba(0, 0, 0, 0.4);
          }
          .xhs-watermark {
            position: absolute;
            bottom: 12px;
            right: 12px;
            font-size: 10px;
            color: rgba(0, 0, 0, 0.2);
          }
        `}</style>
        
        {showHeader && (
          <div className="xhs-header">
            <div className="xhs-header-avatar">
              <Image
                src={authorAvatar}
                alt={authorName}
                width={40}
                height={40}
                unoptimized
              />
            </div>
            <div className="xhs-header-info">
              <div className="xhs-header-name">{authorName}</div>
              <div className="xhs-header-badge">发布于小红书</div>
            </div>
          </div>
        )}
        
        <div className="xhs-content-wrapper">
          <div id="xhs-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        
        {showFooter && (
          <div className="xhs-footer">
            <div className="xhs-tags">
              {tags.map((tag, index) => (
                <span key={index} className="xhs-tag">#{tag}</span>
              ))}
            </div>
            <div className="xhs-meta">
              编辑于 刚刚 · 不允许二次转载
            </div>
          </div>
        )}
        
        <div className="xhs-watermark">ChicPage</div>
      </div>
    );
  }
);

XHSLongImagePreview.displayName = "XHSLongImagePreview";
