import { useFetch } from "src/hooks/useSupabaseQuery";

export function Fetcher({
    fetch,
    children,
  }: {
    fetch;
    children: (data: { result; loading; error }) => JSX.Element;
  }) {
    const { data: result, loading, error } = useFetch(fetch);
  
    return children({ result, loading, error });
  }