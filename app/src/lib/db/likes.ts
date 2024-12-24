import supabase from "../supabase";
import { getuserid } from "./auth";

export async function check_like(listing_id: string) {
  const user_id = await getuserid();
  if(!user_id )return false
  const { error, count } = await supabase
    .from("likes")
    .select("", { count: "exact", head: true })
    .match({ listing_id, user_id });
  return !error && count==1;
}
export async function likeListing(listing_id: string) {

  const user_id = await getuserid();
  if(!user_id )return{data:null,error:{message:'user signin required'}}
  return supabase.from("likes").upsert(
    {
      listing_id,
      user_id
    },
    
  );
}
export async function unlike(listing_id: string) {
  const user_id = await getuserid();
  if(!user_id )return{data:null,error:{message:'user signin required'}}
  return await supabase
    .from("likes")
    .delete()
    .match({
      listing_id,
      user_id
    })


}
