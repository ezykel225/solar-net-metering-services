import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "./env";

/**
 * Cookie-free client for PUBLIC content (anon role, RLS limits it to published
 * rows). Not tied to a visitor's request, so public pages stay statically
 * cacheable (ISR). Returns null when Supabase is not configured.
 */
export function createSupabasePublicClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
