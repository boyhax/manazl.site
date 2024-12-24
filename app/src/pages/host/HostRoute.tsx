import { IonProgressBar } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { error } from "console";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage } from "src/components/errorMessage";
import useMyListing from "src/hooks/useMyListing";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import NewHost from "./listings/newHost";

async function myhostLoader(userid) {
  const { data, error } = await supabase
    .from("listings")
    .select()
    .eq("user_id", userid)
    .single();
  if (error) throw Error(error.message);
  return data;
}
export default function () {
  const { user } = auth();
  const { t } = useTranslate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["myHost", user.id],
    queryFn: async () => await myhostLoader(user.id),
    enabled: !!user,
    refetchOnWindowFocus: false
  });


  if (isLoading) {
    return <IonProgressBar type={"indeterminate"} />;
  }
  if (!data)
    return <NewHost />

  return <Outlet />;
}
