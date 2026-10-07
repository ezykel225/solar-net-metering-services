import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAuthorized, NotConfigured } from "@/components/admin/AccessStates";

/**
 * Every admin page requires (1) a verified session and (2) admin authorization.
 * Server actions check the same thing again on every call.
 */
async function countNewQuotes() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;
  const { count } = await supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new");
  return count ?? 0;
}

export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The badge count runs alongside the admin check. It is only shown to
  // confirmed admins, and RLS returns nothing to anyone else.
  const [ctx, count] = await Promise.all([getAdminContext(), countNewQuotes()]);
  if (ctx.state === "unconfigured") return <NotConfigured />;
  if (ctx.state === "anonymous") redirect("/admin/login");
  if (ctx.state === "forbidden") return <NotAuthorized email={ctx.email} />;

  return (
    <AdminShell email={ctx.email} newQuotes={count}>
      {children}
    </AdminShell>
  );
}
