import { IonProgressBar } from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { error } from "console";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ErrorMessage } from "src/components/errorMessage";
import useMyListing from "src/hooks/useMyListing";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";

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





  return <Outlet />;
}
