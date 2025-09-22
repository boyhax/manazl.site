'use client'
import { useTranslate } from "@tolgee/react";
import ReactStars from "react-rating-stars-component";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import supabase from "src/lib/supabase";
import { Label } from "./ui/label";
import LoadingSpinnerComponent from "react-spinners-components";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EmptyMessage } from "./errorMessage";

export default function ReviewsSection({ listing_id }: any) {
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
    return null;
  }
  if (loading) {
    return (
      <LoadingSpinnerComponent type={'Infinity'} />
    );
  }
  return (
    <div className={"w-full flex flex-col items-center gap-2"}>

      <div className={"flex flex-col gap-2 items-start w-full rounded-lg"}>
        {data ? data.map!((review: any) => {
          return (
            <div className={"flex flex-row gap-2 w-full"}>
              <div>
                <Avatar >
                  <AvatarImage src={review.user?.avatar_url!} />
                  <AvatarFallback>NA</AvatarFallback>
                </Avatar>
                <p>{review.user?.full_name!}</p>
              </div>
              <div className={"flex flex-col "}>
                <ReactStars
                  edit={false}
                  count={5}
                  size={15}
                  value={review.rating / 20}
                />
                <Label >{review.text}</Label>
              </div>
            </div>
          );
        }) : null}
        {!data || data?.length <= 0 && (
          <div className="flex m-auto p-10">
            <EmptyMessage message="No Reviews Found" />
          </div>
        )}
      </div>
    </div>

  );
}
