import { IonProgressBar } from "@ionic/react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { EmptyMessage, ErrorMessage } from "src/components/errorMessage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import useSearchfilter from "src/hooks/useSearchFilter";
import { BOOKINGSTATES } from "src/lib/db/bookings";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import { useMediaQuery } from "usehooks-ts";
import ReservationCardsView from "../ui/HostReservationCardsView";

const fetchBookings = async (
  userId: string,
  filterState?: string,
  filterType?: string
) => {
  let query = supabase
    .from("reservations")
    .select(
      "*,user:profiles(avatar_url,full_name),cancel_request:reservation_cancel_request(id,cancel_reason),variants(listing_id,listings(thumbnail,title,id))"
    )
    .eq("variants.listings.user_id", userId)
    .order("created_at", { ascending: false });

  if (filterState) {
    query = query.eq("state", filterState);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export default function ReservationList() {
  const { t } = useTranslate();
  const user = auth((s) => s.user);
  const screenBig = useMediaQuery("(min-width: 768px)");
  const { filter, updateFilter } = useSearchfilter<{ state: string | undefined, type: string | undefined }>();
  const queryClient = useQueryClient();

  const {
    data: reservations,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["hostReservations", user.id, filter.state, filter.type],
    queryFn: () => fetchBookings(user.id, filter.state, filter.type),
    enabled: !!user.id,
  });
  console.log('reservations :>> ', reservations, error,);
  if (isLoading) {
    return <IonProgressBar type={"indeterminate"} />;
  }
  if (error) return <ErrorMessage message={"Error Obs!"} />;
  if (!reservations) return <EmptyMessage message={t("No reservations found")} />;
  return (
    <ScrollArea className="h-[65vh] pb-20 overflow-y-auto scroll-my-12 ">
      <div className={"flex items-center gap-2 my-2"}>
        <Select
          value={filter.state || "all"}
          onValueChange={(value) =>
            updateFilter({ state: value == "all" ? undefined : value })
          }
        >
          <SelectTrigger className="w-[130px] bg-secondary">
            <SelectValue>{t(filter.state || "all")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["all", ...BOOKINGSTATES].map((name) => {
              return <SelectItem value={name}>{t(name)}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>

      <ReservationCardsView data={reservations} />

      {!reservations ||
        (reservations.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            {t("No reservations found.")}
          </div>
        ))}
    </ScrollArea>
  );
}
