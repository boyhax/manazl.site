'use client'
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import qs from "qs";
import { useMemo } from "react";

export default function useSearchfilter<T>() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function setFilter(filter: Partial<T>) {
    let query = qs.stringify(filter);
    router.push(`${pathname}?${query}`);
  }

  const filter = useMemo(() => qs.parse(params.toString()) as T, [params]);

  function updateFilter(data: any) {
    setFilter({ ...filter, ...data });
  }

  return { filter, setFilter, updateFilter };
}
