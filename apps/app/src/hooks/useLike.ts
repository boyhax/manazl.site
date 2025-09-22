import { useEffect, useMemo, useState } from "react";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import useSupabaseQuery from "./useSupabaseQuery";
import { check_like, likeListing, unlike } from "src/lib/db/likes";

export default function (id: string, isliked?) {
  const [error, seterror] = useState<any>();
  const [liked, setliked] = useState<boolean>(isliked);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (isliked != undefined) return;
    async function fetch() {
      setloading(true);
      const like = await check_like(id);

      setliked(like);
      setloading(false);
    }
    fetch();
  }, []);

  const onLike = async () => {
    const { data, error } = await likeListing(id);
    console.log(" onLike error :>> ", error);
    !error && setliked(true);
  };
  const ondisLike = async () => {
    const { data, error } = await unlike(id);
    console.log("ondisLike error :>> ", error);
    !error && setliked(false);
  };
  return { ondisLike, onLike, liked, error, loading };
}
