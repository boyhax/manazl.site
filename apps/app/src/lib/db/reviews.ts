import supabase from "../supabase";
import { getuserid } from "./auth";

export async function submitReview(data: { text: string; rating: number }) {
  const user_id = await getuserid();
  if (!user_id) return { data: null, error: { message: "user not signed in" } };
  return await supabase.from("reviews").upsert({ ...data, user_id });
}
