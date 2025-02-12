import { createClient } from "@/app/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
export type HostType = {
  id: number; // Unique identifier for the host type
  label_ar: string; // Arabic label
  label: string; // English label
  icon: string; // Icon name
  image: string; // Image URL or filename
};

const fetch = async () => {
  let client = createClient();
  const { data, error } = await client.from("host_types").select();

  if (error) {
    throw new Error(error.message);
  }
  return data as HostType[];
};

export const useHostTypes = ()=>useQuery({
  queryKey: ["host_types"],
  queryFn: fetch,
});