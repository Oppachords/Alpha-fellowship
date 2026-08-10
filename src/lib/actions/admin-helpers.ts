"use server";

import { auth } from "@/lib/auth";
import { hasAdminRole } from "@/lib/auth/permissions";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !hasAdminRole(session.user.roles)) {
    return { error: "Unauthorized." as const, session: null };
  }
  return { error: null, session };
}

export type ActionState = { success?: boolean; error?: string } | undefined;
