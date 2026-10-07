import type { NextRequest } from "next/server";
import { updateAdminSession } from "@/lib/supabase/proxy";

/** Only the admin area goes through the proxy; the public site is untouched. */
export async function proxy(request: NextRequest) {
  return updateAdminSession(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
