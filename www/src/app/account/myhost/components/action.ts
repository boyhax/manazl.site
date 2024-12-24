"use server";
import { createClient } from "@/app/lib/supabase/server";
import { ListingformProps } from "./listingForm.types";

export async function upsertListing(data: ListingformProps) {
  const client = createClient();
  return await client
    .from("listings")
    .upsert({
      ...data,
      thumbnail: data.images[0],
    })
    .select()
    .single();
}
