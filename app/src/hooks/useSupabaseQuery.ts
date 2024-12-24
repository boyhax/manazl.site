import { useEffect, useState } from "react";
import supabase, { SupabaseBuilder } from "src/lib/supabase";

function  useSupabaseQuery <T = any>(query: SupabaseBuilder,keys=[])  {
  const {
    data,
    error,
    fetch: _fetch,
    loading,
    setdata,
    refetch,
  } = useFetch(async () => await query);

  const _setData = (_data: any) => {
    setdata({ ...data, data: _data });
  };
  useEffect(() => {
    _fetch(async () => await query);
  }, keys);
  return {
    data: data?.data,
    error: data?.error || error,
    loading,
    count: data?.count,
    fetch: (query: SupabaseBuilder) => _fetch(async () => await query),
    setdata: _setData,
    refetch,
  };
};

export default useSupabaseQuery;

export function useFetch<T = any>(query: () => Promise<T>) {
  const [data, setdata] = useState<T | undefined>(null);
  const [error, seterror] = useState<any>(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    fetch(query);
  }, []);

  async function fetch(query) {
    setloading(true);
    try {
      const res = await query();
      setdata(res);

      return res;
    } catch (error) {
      seterror(error);

      return error;
    } finally {
      setloading(false);
    }
  }
  const refetch = () => fetch(query);
  return { data, error, loading, fetch, setdata, refetch };
}
