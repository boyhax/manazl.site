import { createClient } from "@/app/lib/supabase/api";
import { refreshToken } from "firebase-admin/app";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const client = await createClient(req);
  const {
    data: { session },
  } = await client.auth.getSession();

  return NextResponse.json({
    access_token: session?.access_token,
    refreshToken: session?.refresh_token,
  });
}
