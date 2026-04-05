import type { WechatTheme } from "@/lib/themes";

export interface ThemeBackgroundStyle {
  backgroundColor: string;
  backgroundImage?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  color?: string;
  fontFamily?: string;
}

export function getThemeBackgroundStyle(theme: Pick<WechatTheme, "containerStyle">): ThemeBackgroundStyle {
  const backgroundMatch = theme.containerStyle.match(/background-color:\s*([^;]+)/i)
    ?? theme.containerStyle.match(/background:\s*(#[a-fA-F0-9]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|[a-z]+)/i);
  const backgroundImageMatch = theme.containerStyle.match(/background-image:\s*([^;]+)/i);
  const backgroundRepeatMatch = theme.containerStyle.match(/background-repeat:\s*([^;]+)/i);
  const backgroundSizeMatch = theme.containerStyle.match(/background-size:\s*([^;]+)/i);
  const backgroundPositionMatch = theme.containerStyle.match(/background-position:\s*([^;]+)/i);
  const colorMatch = theme.containerStyle.match(/color:\s*([^;]+)/i);
  const fontFamilyMatch = theme.containerStyle.match(/font-family:\s*([^;]+)/i);

  const backgroundImage = backgroundImageMatch?.[1].trim();

  return {
    backgroundColor: backgroundMatch ? backgroundMatch[1].trim() : "#ffffff",
    backgroundImage,
    backgroundRepeat: backgroundRepeatMatch?.[1].trim() ?? (backgroundImage ? "repeat" : undefined),
    backgroundSize: backgroundSizeMatch?.[1].trim(),
    backgroundPosition: backgroundPositionMatch?.[1].trim() ?? (backgroundImage ? "top left" : undefined),
    color: colorMatch?.[1].trim(),
    fontFamily: fontFamilyMatch?.[1].trim(),
  };
}
