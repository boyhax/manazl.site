import {
  IonContent,
  IonProgressBar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { FunctionComponent, useMemo } from "react";
import { useNavigate } from "react-router";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import HostCard from "../Home/components/HostCard";
import { ErrorBoundary } from "src/router";
import SimpleHostCard from "../Home/components/SimpleHostCard";
import { useTranslate } from "@tolgee/react";
import { EmptyMessage } from "src/components/errorMessage";
import BackButton from "src/components/BackButton";

interface MyListingsProps {}

const MyLiked: FunctionComponent<MyListingsProps> = () => {
  const { session } = auth();
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const {t} = useTranslate()
  const {
    data: liked,
    error,
    loading,

  } = useSupabaseQuery(
    supabase
      .from("likes")
      .select("listings(*)")
      .eq("user_id", session?.user?.id)
  );

  console.log('liked :>> ', liked);
  if(error)return <ErrorBoundary/>
  return (
    <div className="container mx-auto px-4 py-8 overflow-y-auto pb-16 scroll-smooth">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <BackButton/>
      </div>
      <div className={"flex flex-row flex-wrap  gap-1 w-full lg:p-5 md:p-3"}>
        {loading && <IonProgressBar type={"indeterminate"} />}
        {!liked && (
        <div
          className={"flex flex-col items-center justify-center w-full mt-12"}
        >
          <EmptyMessage message={t("try to make likes")} />

        </div>
        )}
        {liked && liked.map((value, i) => {
          return <HostCard data={value.listings} key={"likedlisting"+i} />;
        })}
      </div>
    </div>
  );
};

export default MyLiked;
