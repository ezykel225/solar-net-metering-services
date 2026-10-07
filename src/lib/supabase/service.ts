import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "./env";

/**
 * SERVER-ONLY service client. Bypasses RLS, so it is used in exactly one place:
 * the /api/quote route, to insert validated quote requests.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (the legacy service_role key or a new
 * secret key, sb_secret_…). Never prefix it with NEXT_PUBLIC_ and never import
 * this module from a Client Component (the "server-only" import enforces that).
 */
export function createSupabaseServiceClient() {
  const env = getSupabasePublicEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!env || !serviceKey) return null;
  return createClient(env.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
