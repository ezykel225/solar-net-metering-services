import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "./env";

/**
 * Runs for /admin routes only (see src/proxy.ts):
 *  1. refreshes the Supabase session cookie, and
 *  2. sends visitors without a valid session to /admin/login.
 * Admin AUTHORIZATION (admin_users) is checked again on the server in the
 * admin layout and in every server action — the proxy is only a first gate.
 */
export async function updateAdminSession(request: NextRequest) {
  const env = getSupabasePublicEnv();
  // Not configured: let the admin pages render their "not configured" message.
  if (!env) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, String(value)));
      },
    },
  });

  // getClaims() verifies the JWT; never trust getSession() on the server.
  const { data } = await supabase.auth.getClaims();
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!data?.claims && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  // Admin pages are private: never cache them anywhere.
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
