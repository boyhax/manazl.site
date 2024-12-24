import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useEffect } from "react";
import supabase from "src/lib/supabase";

async function getAvailableRooms(
  id,
  start = new Date(),
  end = addDays(new Date(), 1)
) {
  const { data, error } = await supabase
    .rpc("get_listing_rooms", {
      p_listing_id: id,
      p_start: start,
      p_end: end,
    })
    .select();

  error && console.log(error.message);
  return { data, error };
}
export default function useRooms({
  id,
  checkin = new Date(),
  checkout = addDays(new Date(), 1),
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["rooms", id, checkin.toDateString(), checkout.toDateString()],
    queryFn: getRooms,
  });
  async function getRooms() {
    const { data, error } = await getAvailableRooms(id, checkin, checkout);
    if (error) throw Error(error.message);
    return data;
  }

  return { data, isLoading };
}
