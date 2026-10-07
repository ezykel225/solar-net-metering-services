/**
 * Supabase environment configuration.
 *
 * Public (safe in the browser):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  — the anon key or the new publishable key (sb_publishable_…)
 *   (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is accepted as an alternative name.)
 *
 * Server-only (never prefixed with NEXT_PUBLIC_): see ./service.ts
 *
 * When these are not set, the public site uses its local fallback content and
 * the admin area shows a "not configured" message instead of failing.
 */
export type SupabasePublicEnv = { url: string; anonKey: string };

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)?.trim();
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
}

export const isSupabaseConfigured = () => getSupabasePublicEnv() !== null;

/** Storage bucket for admin-uploaded images. */
export const MEDIA_BUCKET = "website-media";

/**
 * Resolves a stored image path to a public URL (safe in browser and server).
 * - "/images/..." bundled site images are returned as-is
 * - "projects/<uuid>.jpg" style paths point to the public website-media bucket
 */
export function publicMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/")) return path;
  if (/^https:\/\//.test(path)) return path;
  const env = getSupabasePublicEnv();
  if (!env) return null;
  const clean = path.split("/").map(encodeURIComponent).join("/");
  return `${env.url}/storage/v1/object/public/${MEDIA_BUCKET}/${clean}`;
}
