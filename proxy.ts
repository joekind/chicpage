import { NextRequest, NextResponse, userAgent } from "next/server";

const MOBILE_PATH = "/workspace/mobile";
const WORKSPACE_PATH = "/workspace";

export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  if (nextUrl.pathname !== WORKSPACE_PATH) {
    return NextResponse.next();
  }

  const viewOverride = nextUrl.searchParams.get("view");

  if (viewOverride === "desktop") {
    return NextResponse.next();
  }

  const deviceType = userAgent(request).device.type;
  const shouldUseMobile =
    viewOverride === "mobile" ||
    deviceType === "mobile" ||
    deviceType === "tablet";

  if (!shouldUseMobile) {
    return NextResponse.next();
  }

  const rewriteUrl = nextUrl.clone();
  rewriteUrl.pathname = MOBILE_PATH;
  rewriteUrl.searchParams.delete("view");

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/workspace"],
};
