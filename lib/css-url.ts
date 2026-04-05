export function resolveBackgroundImageUrl(backgroundImage?: string): string | undefined {
  if (!backgroundImage || typeof window === "undefined") {
    return backgroundImage;
  }

  return backgroundImage.replace(/url\((['"]?)(.*?)\1\)/gi, (_match, quote, rawUrl) => {
    const url = rawUrl.trim();

    if (!url || url.startsWith("data:") || url.startsWith("blob:") || /^[a-z]+:/i.test(url)) {
      return `url(${quote}${url}${quote})`;
    }

    const absoluteUrl = new URL(url, window.location.origin).toString();
    return `url(${quote}${absoluteUrl}${quote})`;
  });
}
