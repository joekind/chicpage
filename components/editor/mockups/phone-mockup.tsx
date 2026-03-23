"use client";

import React from "react";
import { IPhoneMockup, IPhoneMockupProps } from "./iphone-mockup";
// Future imports for other phone models can be added here, e.g.:
// import { PixelMockup } from "./pixel-mockup";
// import { GalaxyMockup } from "./galaxy-mockup";

/**
 * 支持多种手机模型的统一外壳组件。
 * 目前仅实现 iPhone（默认），后续可以通过在 `model` 中传入不同的标识来切换到其他实现。
 */
export interface PhoneMockupProps extends IPhoneMockupProps {
  /** 手机模型标识，默认 "iphone" */
  model?: "iphone" | string; // 预留 string 以便以后扩展自定义模型
}

export const PhoneMockup = ({ model = "iphone", ...rest }: PhoneMockupProps) => {
  switch (model) {
    case "iphone":
    default:
      // 目前只有 iPhone 实现，直接复用 IPhoneMockup
      return <IPhoneMockup {...rest} />;
    // case "pixel":
    //   return <PixelMockup {...rest} />;
    // case "galaxy":
    //   return <GalaxyMockup {...rest} />;
  }
};
