import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export type AdminContext =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "forbidden"; email: string | null }
  | { state: "admin"; userId: string; email: string | null; supabase: ServerClient };

/**
 * Resolves who is making this request.
 * Admin = (1) a verified Supabase session AND (2) a row in public.admin_users,
 * checked through the is_admin() database function. Being signed in alone is
 * never enough. Cached per request.
 */
export const getAdminContext = cache(async (): Promise<AdminContext> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { state: "unconfigured" };

  // getClaims() validates the JWT signature (unlike getSession()).
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (claimsError || !claims?.sub) return { state: "anonymous" };

  const email = typeof claims.email === "string" ? claims.email : null;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return { state: "forbidden", email };

  return { state: "admin", userId: claims.sub, email, supabase };
});

/** For admin pages: redirects anyone who is not a confirmed admin. */
export async function requireAdminPage() {
  const ctx = await getAdminContext();
  if (ctx.state !== "admin") redirect("/admin/login");
  return ctx;
}

export class AdminAuthError extends Error {}

/** For server actions: throws unless the caller is a confirmed admin. */
export async function requireAdminAction() {
  const ctx = await getAdminContext();
  if (ctx.state !== "admin") throw new AdminAuthError("Not authorized");
  return ctx;
}
