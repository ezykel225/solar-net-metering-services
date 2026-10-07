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

/** One Supabase client per request, shared by the admin check and page queries. */
const getRequestClient = cache(createSupabaseServerClient);

/**
 * Resolves who is making this request.
 * Admin = (1) a verified Supabase session AND (2) a row in public.admin_users,
 * checked through the is_admin() database function. Being signed in alone is
 * never enough. Cached per request.
 *
 * Both checks run at the same time (one round trip instead of two). The
 * is_admin() result is only trusted when the JWT itself verifies.
 */
export const getAdminContext = cache(async (): Promise<AdminContext> => {
  const supabase = await getRequestClient();
  if (!supabase) return { state: "unconfigured" };

  // getClaims() validates the JWT signature (unlike getSession()).
  const [{ data: claimsData, error: claimsError }, { data: isAdmin, error }] = await Promise.all([
    supabase.auth.getClaims(),
    supabase.rpc("is_admin"),
  ]);
  const claims = claimsData?.claims;
  if (claimsError || !claims?.sub) return { state: "anonymous" };

  const email = typeof claims.email === "string" ? claims.email : null;
  if (error || isAdmin !== true) return { state: "forbidden", email };

  return { state: "admin", userId: claims.sub, email, supabase };
});

/** For admin pages: redirects anyone who is not a confirmed admin. */
export async function requireAdminPage() {
  const ctx = await getAdminContext();
  if (ctx.state !== "admin") redirect("/admin/login");
  return ctx;
}

/**
 * For admin pages: runs the page's queries at the same time as the admin
 * check, so a page costs one database round trip instead of two.
 * Safe because the queries run as the signed-in user (RLS applies), and the
 * results are only returned after the admin check has passed; otherwise the
 * visitor is redirected and the results are discarded.
 */
export async function loadAdminPage<T>(load: (supabase: ServerClient) => PromiseLike<T>) {
  const supabase = await getRequestClient();
  if (!supabase) redirect("/admin/login");
  const [ctx, data] = await Promise.all([requireAdminPage(), load(supabase)]);
  return { ...ctx, data };
}

export class AdminAuthError extends Error {}

/** For server actions: throws unless the caller is a confirmed admin. */
export async function requireAdminAction() {
  const ctx = await getAdminContext();
  if (ctx.state !== "admin") throw new AdminAuthError("Not authorized");
  return ctx;
}
