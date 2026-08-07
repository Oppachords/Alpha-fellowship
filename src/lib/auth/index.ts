import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { hasAdminRole } from "@/lib/auth/permissions";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const loginType = (credentials.loginType as string) ?? "member";

        let user;
        try {
          user = await db.user.findUnique({
            where: { email },
            include: {
              roles: {
                include: { role: true },
              },
            },
          });
        } catch {
          return null;
        }

        if (!user?.passwordHash) {
          return null;
        }

        const roleSlugs = user.roles.map((entry) => entry.role.slug);

        if (loginType === "admin") {
          if (!hasAdminRole(roleSlugs) || !user.isActive) {
            return null;
          }
        } else {
          if (!roleSlugs.includes("member")) {
            return null;
          }
          if (!user.isActive) {
            return null;
          }
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roles: roleSlugs,
        };
      },
    }),
  ],
});
