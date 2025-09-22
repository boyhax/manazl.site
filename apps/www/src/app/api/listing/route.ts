import { createClient } from "@/app/lib/supabase/api";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const client = createClient(req);
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return Response.json({ error: "user not found" });
  const { data, error } = await client
    .from("listings")
    .select()
    .eq("user_id", user.id)
    .single();
  return NextResponse.json({ data, error });
}
