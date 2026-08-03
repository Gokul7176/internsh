interface RateLimitOptions {
  intervalMs?: number;
  maxRequests?: number;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory token-bucket rate limiter for Next.js API route handlers.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { isAllowed: boolean; remaining: number; resetMs: number } {
  const intervalMs = options.intervalMs ?? 60_000; // default 1 minute
  const maxRequests = options.maxRequests ?? 20;   // default 20 requests per minute

  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + intervalMs,
    });
    return {
      isAllowed: true,
      remaining: maxRequests - 1,
      resetMs: intervalMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      isAllowed: false,
      remaining: 0,
      resetMs: record.resetTime - now,
    };
  }

  record.count += 1;
  rateLimitStore.set(identifier, record);

  return {
    isAllowed: true,
    remaining: maxRequests - record.count,
    resetMs: record.resetTime - now,
  };
}

/**
 * Periodically purge expired records every 5 minutes to prevent memory leak.
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 300_000);
}
