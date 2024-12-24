import {
  IonLabel,
  IonList
} from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import ReactStars from "react-rating-stars-component";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import supabase from "src/lib/supabase";
import Avatar from "./Avatar";
import { EmptyMessage, ErrorMessage } from "./errorMessage";
import LoadingSpinnerComponent from 'react-spinners-components';

export default function ({ listing_id }) {
  const { t } = useTranslate();
  const { data, error, loading } = useSupabaseQuery(
    supabase
      .from("reviews")
      .select("*,user:profiles!inner(avatar_url,full_name),listing:listings!inner(short_id)", {
        count: "estimated",
        head: false,
      })
      .eq("listing.short_id", listing_id)
  );
  console.log("reviews query :>> ", data, error, loading);
  if (error) {
    return <ErrorMessage message="Sorry !" />;
  }
  if (loading) {
    return (
      <LoadingSpinnerComponent type={'Infinity'} />
    );
  }
  return (
    <div className={"w-full flex flex-col items-center gap-2"}>

      <div className={"flex flex-col gap-1 w-full rounded-lg"}>
        {data ? data.map!((review, index, array) => {
          return (
            <div className={"flex flex-row gap-2 w-full"}>
              <div>
                <Avatar src={review.user?.avatar_url!} />
                <p>{review.user?.full_name!}</p>
              </div>
              <div className={"flex flex-col "}>
                <ReactStars
                  edit={false}
                  count={5}
                  size={15}
                  value={review.rating / 20}
                />
                <IonLabel slot={"center"}>{review.text}</IonLabel>
              </div>
            </div>
          );
        }) : null}
        {!data || data?.length <= 0 && (
          <div className="p-10">
            <EmptyMessage message="No Reviews Found" />
          </div>
        )}
      </div>
    </div>

  );
}
