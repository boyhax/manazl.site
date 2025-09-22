import { createClient } from "@/app/lib/supabase/api";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const client = createClient(req);
  const { data, error } = await client.from("chats").select();
  return NextResponse.json({ data, error });
}
