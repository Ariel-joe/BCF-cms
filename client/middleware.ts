import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect specific application routes (those under the (protected) route group).
export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public files and next internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Determine cookie name to check. Prefer an explicit public env var if provided
    // (set NEXT_PUBLIC_AUTH_COOKIE_NAME in your frontend env), otherwise fall back
    // to common cookie names. Middleware runs at the edge and env vars prefixed
    // with NEXT_PUBLIC_ are inlined at build time.
    const publicCookieName = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || "";
    const fallbackNames = [
        "connect.sid",
        "session",
        "token",
        "__Host-next-auth.session-token",
        "next-auth.session-token",
    ];

    const cookieNames = [publicCookieName, ...fallbackNames].filter(Boolean);

    // Allow Authorization header bearer tokens as well (in case API uses JWT in header)
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return NextResponse.next();
    }

    const hasAuthCookie = cookieNames.some((name) =>
        Boolean(req.cookies.get(name))
    );

    if (hasAuthCookie) {
        return NextResponse.next();
    }

    // If no auth cookie, redirect to login. Attach original path so the UI can return the user after login.
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
        "from",
        req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
}

// Only run middleware for known protected URL prefixes (these correspond to routes inside the (protected) route group).
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/blog/:path*",
        "/form/:path*",
        "/welfare/:path*",
        "/donations/:path*",
        "/account/:path*",
        "/profile/:path*",
    ],
};
