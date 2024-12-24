"use server";
import { createClient } from "@/app/lib/supabase/server";

export const getUserListings = async (user_id: string) => {
  const supabase = createClient();

  return await supabase
    .from("listings")
    .select("*,variants(*)")
    .eq("user_id", user_id);
};

export async function updateUser(data: any) {
  const supabase = createClient();
  return await supabase.auth.updateUser({ data: { ...data } });
}
