import qs from "qs";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function useSearchfilter<T>() {
  const [params, setparams] = useSearchParams();

  function setFilter(filter: Partial<T>) {
    let newstring = qs.stringify(filter);
    setparams(newstring);
  }

  const filter = useMemo(() => qs.parse(params.toString()) as T, [params]);

  function updateFilter(data) {
    setFilter({ ...filter, ...data });
  }

  return { filter, setFilter, updateFilter };
}
