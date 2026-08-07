import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import {
  ADMIN_BASE_PATH,
  ADMIN_LOGIN_PATH,
  isAdminProtectedPath,
} from "@/lib/constants/admin";
import {
  MEMBER_LOGIN_PATH,
  isMemberProtectedPath,
} from "@/lib/constants/member";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isAdminRoute = isAdminProtectedPath(pathname);
  const isMemberRoute = isMemberProtectedPath(pathname);
  const isMemberLoginPage = pathname === MEMBER_LOGIN_PATH;
  const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH;

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL(ADMIN_LOGIN_PATH, req.nextUrl));
    }

    const roles = req.auth?.user?.roles ?? [];
    const canAccessAdmin = roles.some((role) =>
      ["super-admin", "admin", "editor", "pastor"].includes(role)
    );

    if (!canAccessAdmin) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }

  if (isMemberRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL(MEMBER_LOGIN_PATH, req.nextUrl));
    }

    const roles = req.auth?.user?.roles ?? [];
    if (!roles.includes("member")) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }

  if (isMemberLoginPage && isLoggedIn) {
    const roles = req.auth?.user?.roles ?? [];
    if (roles.includes("member") && req.auth?.user) {
      return Response.redirect(new URL("/member", req.nextUrl));
    }
  }

  if (isAdminLoginPage && isLoggedIn) {
    const roles = req.auth?.user?.roles ?? [];
    if (roles.some((role) => ["super-admin", "admin", "editor", "pastor"].includes(role))) {
      return Response.redirect(new URL(ADMIN_BASE_PATH, req.nextUrl));
    }
  }
});

export const config = {
  matcher: [
    "/church/admin/:path*",
    "/member/:path*",
  ],
};
