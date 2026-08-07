type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  success: boolean;
  retryAfterSeconds?: number;
};

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { success: true };
}

export async function enforceRateLimit(
  scope: string,
  limit: number,
  windowMs: number,
  identifier: string
) {
  const result = checkRateLimit(`${scope}:${identifier}`, limit, windowMs);

  if (!result.success) {
    return {
      error: `Too many requests. Please try again in ${result.retryAfterSeconds} seconds.`,
    };
  }

  return null;
}
