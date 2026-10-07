import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { NotAuthorized, NotConfigured } from "@/components/admin/AccessStates";

/**
 * Every admin page requires (1) a verified session and (2) admin authorization.
 * Server actions check the same thing again on every call.
 */
export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ctx = await getAdminContext();
  if (ctx.state === "unconfigured") return <NotConfigured />;
  if (ctx.state === "anonymous") redirect("/admin/login");
  if (ctx.state === "forbidden") return <NotAuthorized email={ctx.email} />;

  const { count } = await ctx.supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new");
  return (
    <AdminShell email={ctx.email} newQuotes={count ?? 0}>
      {children}
    </AdminShell>
  );
}
