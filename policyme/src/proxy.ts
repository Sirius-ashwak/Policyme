import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Route-to-role access control matrix.
 * Duplicated from config/roles.ts because Edge Runtime
 * cannot import from non-edge-compatible modules reliably.
 */
const ROUTE_ROLE_MAP: Record<string, string[]> = {
    "/portal":                ["Customer", "Admin"],
    "/dashboard/adjuster":    ["Adjuster", "Admin"],
    "/dashboard/underwriter": ["Underwriter", "Admin"],
    "/dashboard/manager":     ["Manager", "Admin"],
    "/dashboard/admin":       ["Admin"],
};

const PUBLIC_PREFIXES = ["/", "/login", "/signup", "/terms", "/privacy", "/support", "/api/auth"];

function isPublicRoute(pathname: string): boolean {
    // Exact match for "/"
    if (pathname === "/") return true;
    // Prefix match for other public routes
    return PUBLIC_PREFIXES.some(
        (prefix) => prefix !== "/" && pathname.startsWith(prefix)
    );
}

function getRequiredRoles(pathname: string): string[] | null {
    // Find the most specific matching route prefix
    const matchingRoutes = Object.keys(ROUTE_ROLE_MAP)
        .filter((route) => pathname.startsWith(route))
        .sort((a, b) => b.length - a.length); // Most specific first

    if (matchingRoutes.length > 0) {
        return ROUTE_ROLE_MAP[matchingRoutes[0]];
    }
    return null;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow public routes through
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // 2. Allow static files and Next.js internals
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // 3. Check for authentication token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });

    // 4. No token -> redirect to login
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 5. Check role-based access
    const requiredRoles = getRequiredRoles(pathname);
    if (requiredRoles) {
        const userRole = token.role as string;
        if (!requiredRoles.includes(userRole)) {
            // User is authenticated but wrong role
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("error", "AccessDenied");
            return NextResponse.redirect(loginUrl);
        }
    }

    // 6. Authenticated + authorized -> allow through
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
