import type { NextAuthConfig } from "next-auth";
import { ADMIN_LOGIN_PATH } from "@/lib/constants/admin";
import { MEMBER_LOGIN_PATH } from "@/lib/constants/member";

export const authConfig = {
  pages: {
    signIn: MEMBER_LOGIN_PATH,
  },
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.roles = user.roles;
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.roles = (token.roles as string[]) ?? [];
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export { ADMIN_LOGIN_PATH, MEMBER_LOGIN_PATH };
