import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import useSupabaseQuery from "./useSupabaseQuery";
import { useEffect, useState } from "react";
import { Listing } from "src/lib/db/listings";

export default function useMyListing() {
  const { session } = auth();
  const user = session ? session.user : null;
  const [listing, setlisting] = useState<Listing>(null);
  const { data, loading, error } = useSupabaseQuery(
    user
      ? supabase.from("listings").select("title,id,created_at,description,rating,images,cost,variants(*),state:listings_state()").eq("user_id", user.id)
      : null
  );
  console.log('data :>> ', data);
  useEffect(() => {
    setlisting(data ? data[0] : null);
  }, [data]);
  
  const listings = data || [];
  const variants = listing?.variants! || [];


  return {
    listing,
    listings,
    variants,
    loading, error 
  };
}
interface Variant {
  id: string;
  price: string;
  dates: string[];
}
