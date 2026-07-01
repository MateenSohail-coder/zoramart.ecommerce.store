import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLECONFIG = {
  admin: {
    home: "/admin/overview",
    allowedPrefixes: ["/admin"],
  },
  seller: {
    home: "/seller/overview",
    allowedPrefixes: ["/seller", "/seller-onboarding"],
  },
  buyer: {
    home: "/user/overview",
    allowedPrefixes: ["/user", "/cart", "/Checkout", "/checkout"],
  },
};

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/otp-verification",
  "/product",
  "/categories",
];

export default async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const role = token?.role;

  // Allow unverified users to access /otp-verification (don't bounce to dashboard)
  const isOtpPage = pathname === "/otp-verification";

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    isOtpPage;

  if (isAuthPage && token && !isOtpPage) {
    const config = ROLECONFIG[role];
    const url = req.nextUrl.clone();
    url.pathname = config?.home || "/";
    return NextResponse.redirect(url);
  }

  const isProtectedRoute = Object.values(ROLECONFIG).some((cfg) =>
    cfg.allowedPrefixes.some((prefix) => pathname.startsWith(prefix)),
  );

  if (isProtectedRoute && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (token?.isBlocked) {
    const url = req.nextUrl.clone();
    url.pathname = "/error";
    url.searchParams.set("blocked", "true");
    return NextResponse.redirect(url);
  }

  // Unverified users — redirect to OTP page (allow if already there)
  if (isProtectedRoute && token && !token.isVerified && !isOtpPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/otp-verification";
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && token) {
    const config = ROLECONFIG[role];

    if (!config) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    const allowed = config.allowedPrefixes.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = config.home;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/seller-onboarding/:path*",
    "/user/:path*",
    "/cart/:path*",
    "/Checkout/:path*",
    "/checkout/:path*",
    "/login",
    "/signup",
    "/otp-verification",
  ],
};
