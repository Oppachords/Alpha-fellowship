import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_BASE_PATH);
  const isLoginPage = pathname === "/login";

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.nextUrl));
    }

    const roles = req.auth?.user?.roles ?? [];
    const canAccessAdmin = roles.some((role) =>
      ["super-admin", "admin", "editor", "pastor"].includes(role)
    );

    if (!canAccessAdmin) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL(ADMIN_BASE_PATH, req.nextUrl));
  }
});

export const config = {
  matcher: ["/church/admin/:path*", "/login"],
};
