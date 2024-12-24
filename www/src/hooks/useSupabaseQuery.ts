"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SupabaseBuilder } from "src/lib/supabase";

function useSupabaseQuery<T = any>(query: SupabaseBuilder, keys: any[] = []) {
  const client = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: [...keys],
    queryFn: async () => {
      const { data, error, count } = await query;
      if (error) throw Error(error.message);
      return { data, count };
    },
  });
  return {
    data: data?.data,
    error,
    loading: isLoading,
    count: data?.count,
    queryFn: async () => {
      const { data, error, count } = await query;
      if (error) throw Error(error.message);
      return { data, count };
    },
    setdata: (data: any) =>
      client.setQueryData(keys, (old) => {
        return data;
      }),
    refetch: () => client.refetchQueries({ queryKey: keys }),
  };
}

export default useSupabaseQuery;
