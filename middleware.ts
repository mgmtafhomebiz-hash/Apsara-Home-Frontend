
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ALLOWED_ROLES = new Set(["admin", "super_admin"]);

export async function middleware(req: NextRequest) {
    const { pathname} = req.nextUrl;
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAdminLoginPage = pathname === "/admin/login";
    const isAdminRoute = pathname.startsWith("/admin");

    if (isAdminLoginPage) {
        const role = String((token as { role?: string } | null)?.role ?? "");
        if (token && ADMIN_ALLOWED_ROLES.has(role)) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
        return NextResponse.next();
    }

    if (isAdminRoute) {
        if(!token) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("callback", pathname);
            return NextResponse.redirect(loginUrl);
        }

        const role = String((token as { role?: string } | null)?.role ?? "");
        if (!ADMIN_ALLOWED_ROLES.has(role)) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
}
