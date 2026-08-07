import { getClientIp } from "@/lib/security/get-client-ip";
import { isHoneypotTriggered } from "@/lib/security/honeypot";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type GuardOptions = {
  scope: string;
  limit?: number;
  windowMs?: number;
};

export async function guardPublicForm(formData: FormData, options: GuardOptions) {
  if (isHoneypotTriggered(formData)) {
    return { honeypot: true as const };
  }

  const ip = await getClientIp();
  const rateLimitError = await enforceRateLimit(
    options.scope,
    options.limit ?? 10,
    options.windowMs ?? 60 * 60 * 1000,
    ip
  );

  if (rateLimitError) {
    return { error: rateLimitError.error };
  }

  return null;
}
