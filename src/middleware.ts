import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/site",
    "/site/(.*)",
    "/api/uploadthing",
    "/api/stripe/webhook",
    "/api/marketplace/(.*)",
    "/api/funnel/preview/(.*)",
    "/api/ai/(.*)",
    "/api/deployments",
    "/api/deployments/(.*)",
    "/deployed/(.*)",
    "/admin/sign-in",
    "/admin/(.*)",
    "/api/admin/auth/(.*)",
    "/pricing",
    "/individual",
    "/Individual/:path*/(auth)/(.*)"
  ],
  ignoredRoutes: [
    "/api/uploadthing",
    "/api/stripe/webhook",
    "/api/admin/auth/(.*)",
    "/admin/(.*)"
  ],
  beforeAuth: (req) => {
    // Custom middleware logic
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    let hostname = req.headers;

    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    //if subdomain exists
    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    if (customSubDomain) {
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url),
      );
    }

    // Handle admin routes - don't redirect these
    if (url.pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }

    // Handle Individual auth routes
    if (url.pathname.includes("/Individual/") && url.pathname.includes("/(auth)/")) {
      return NextResponse.rewrite(new URL(pathWithSearchParams, req.url));
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
      url.pathname.startsWith("/agency") ||
      url.pathname.startsWith("/subaccount")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};