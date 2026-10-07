"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string; email?: string };

const GENERIC_ERROR = "Incorrect email or password.";

/**
 * Admin sign-in (email + password via Supabase Auth).
 * There is no sign-up: admin accounts are created manually in Supabase.
 * A user who signs in but is not listed in admin_users is signed out again.
 */
export async function signInAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!email || !password) return { error: "Enter your email and password.", email };

  const ip = clientIp(await headers());
  const limit = rateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.allowed) return { error: "Too many sign-in attempts. Please wait a few minutes and try again.", email };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "The admin area is not configured yet.", email };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Same message for unknown email / wrong password; never reveal which.
    return { error: error.status === 429 ? "Too many sign-in attempts. Please wait and try again." : GENERIC_ERROR, email };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: "This account does not have access to the admin area.", email };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
