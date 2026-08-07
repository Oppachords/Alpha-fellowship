import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
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
    return Response.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
