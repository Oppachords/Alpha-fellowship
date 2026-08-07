"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn, signOut } from "@/lib/auth";
import { ADMIN_BASE_PATH } from "@/lib/constants/admin";
import { MEMBER_BASE_PATH } from "@/lib/constants/member";
import { getClientIp } from "@/lib/security/get-client-ip";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import { emailSchema, firstZodError } from "@/lib/validations/common";
import { db } from "@/lib/db";

async function checkPendingMember(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user) return null;

    const isMember = user.roles.some((entry) => entry.role.slug === "member");
    if (isMember && !user.isActive) {
      return "Your account is pending approval. You'll be able to sign in once an administrator approves your registration.";
    }

    return null;
  } catch {
    return null;
  }
}

async function guardLogin(scope: "member-login" | "admin-login", email: string) {
  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) {
    return { error: firstZodError(parsedEmail.error) };
  }

  const ip = await getClientIp();
  const rateLimitError = await enforceRateLimit(scope, 5, 15 * 60 * 1000, ip);

  if (rateLimitError) {
    return { error: rateLimitError.error };
  }

  return { email: parsedEmail.data.toLowerCase() };
}

export async function memberLoginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardLogin("member-login", formData.get("email") as string);
  if ("error" in guard) {
    return { error: guard.error };
  }

  const pendingMessage = await checkPendingMember(guard.email);
  if (pendingMessage) {
    return { error: pendingMessage };
  }

  try {
    await signIn("credentials", {
      email: guard.email,
      password: formData.get("password"),
      loginType: "member",
      redirectTo: MEMBER_BASE_PATH,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }

    throw error;
  }

  return { error: undefined };
}

export async function adminLoginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const guard = await guardLogin("admin-login", formData.get("email") as string);
  if ("error" in guard) {
    return { error: guard.error };
  }

  try {
    await signIn("credentials", {
      email: guard.email,
      password: formData.get("password"),
      loginType: "admin",
      redirectTo: ADMIN_BASE_PATH,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }

    throw error;
  }

  return { error: undefined };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
