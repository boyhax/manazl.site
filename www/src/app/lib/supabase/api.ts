import { createClient as cc } from "@supabase/supabase-js";
import { createClient as serverclient } from "@/app/lib/supabase/server";

import { NextRequest } from "next/server";

export function createClient(req: NextRequest) {
  const access_token = req.headers.get("Authorization");
  const refresh_token = req.headers.get("refresh_token");

  if (access_token && refresh_token) {
    const client = cc(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    client.auth.setSession({
      access_token,
      refresh_token,
    });

    return client;
  } else {
    return serverclient();
  }
}
