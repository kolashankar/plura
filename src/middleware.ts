import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const searchParams = url.searchParams.toString();
  const pathWithSearchParams = `${pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // Handle admin routes - skip all authentication
  if (pathname.startsWith('/admin') || pathname.startsWith('/admin-auth') || pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // Only load Clerk for non-admin routes
  if (process.env.CLERK_SECRET_KEY) {
    const { authMiddleware } = await import("@clerk/nextjs");
    
    const clerkMiddleware = authMiddleware({
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
        "/pricing",
        "/individual",
        "/individual/:path*/(auth)/(.*)"
      ],
      ignoredRoutes: [
        "/api/uploadthing",
        "/api/stripe/webhook"
      ],
      beforeAuth: (req) => {
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

        // Handle individual auth routes
        if (url.pathname.includes("/individual/") && url.pathname.includes("/(auth)/")) {
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

    return clerkMiddleware(request);
  }

  // If no Clerk keys, handle basic routing
  let hostname = request.headers;
  
  //if subdomain exists
  const customSubDomain = hostname
    .get("host")
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, request.url),
    );
  }

  // Handle individual auth routes
  if (pathname.includes("/individual/") && pathname.includes("/(auth)/")) {
    return NextResponse.rewrite(new URL(pathWithSearchParams, request.url));
  }

  // Handle admin auth routes
  if (pathname.includes("/admin/") && pathname.includes("/(auth)/")) {
    return NextResponse.rewrite(new URL(pathWithSearchParams, request.url));
  }

  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return NextResponse.redirect(new URL(`/agency/sign-in`, request.url));
  }

  if (
    pathname === "/" ||
    (pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL("/site", request.url));
  }

  if (
    pathname.startsWith("/agency") ||
    pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};