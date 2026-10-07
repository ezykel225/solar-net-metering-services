import "server-only";

/**
 * Best-effort, in-memory sliding-window rate limiter (per server instance).
 * On serverless hosting each instance has its own memory, so this is a first
 * line of defence only; /api/quote also checks recent submissions per email
 * in the database, and a Vercel Firewall rate-limit rule is recommended.
 */
const hits = new Map<string, number[]>();
const MAX_KEYS = 5_000;

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { allowed: false, retryAfterSec: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) {
    // Drop the oldest keys to bound memory.
    for (const k of [...hits.keys()].slice(0, hits.size - MAX_KEYS)) hits.delete(k);
  }
  return { allowed: true, retryAfterSec: 0 };
}

/**
 * Client IP. On Vercel, x-vercel-forwarded-for / x-real-ip / x-forwarded-for
 * are set by the platform (client-supplied values are overwritten).
 */
export function clientIp(headers: Headers): string {
  const first = (name: string) => headers.get(name)?.split(",")[0]?.trim();
  return first("x-vercel-forwarded-for") || first("x-real-ip") || first("x-forwarded-for") || "unknown";
}
