import { createClient } from "@/app/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
export type HostAmenitie = {
  id: number; // Unique identifier for the host type
  label_ar: string; // Arabic label
  label: string; // English label
  icon: string; // Icon name
  image: string; // Image URL or filename
};

const fetch = async () => {
  let client = createClient();
  const { data, error } = await client.from("host_amenities").select();

  if (error) {
    throw new Error(error.message);
  }
  return data as HostAmenitie[];
};

export const useHostAmenities = () =>
  useQuery({
    queryKey: ["host_amenities"],
    queryFn: fetch,
  });