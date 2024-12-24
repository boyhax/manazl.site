'use client'
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
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
import supabase from "src/lib/supabase";
import ReservationCardsView from "../ui/ReservationCardsView";
import LoadingSpinnerComponent from "react-spinners-components";
import { useUserContext } from "@/providers/userProvider";
const BOOKINGSTATES = ["pending", "confirmed", "cancelled", "completed"];

const fetchBookings = async (
  userId: string,
  filterState?: string,
  filterType?: string
) => {
  let query = supabase
    .from("reservations")
    .select(
      "*,user:profiles(avatar_url,full_name),cancel_request:reservation_cancel_request(id,cancel_reason),listing:listings!inner(thumbnail,title,id)"
    )
    .eq("listing.user_id", userId)
    .order("created_at", { ascending: false });

  if (filterState) {
    query = query.eq("state", filterState);
  }

  const { data, error } = await query;
  if (error) throw Error(error.message);
  return data;
};

export default function ReservationList() {
  const { t } = useTranslate();
  const { user } = useUserContext();
  const { filter, updateFilter } = useSearchfilter<{ state: string | undefined, type: string | undefined }>();

  const {
    data: reservations,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["hostReservations", user, filter.state, filter.type],
    queryFn: () => fetchBookings(user?.id!, filter.state, filter.type),
    enabled: !!user,
  });
  console.log('reservations :>> ', reservations, error,);
  if (isLoading) {
    return <LoadingSpinnerComponent type={"Discuss"} />;
  }
  if (error) return <ErrorMessage message={"Error Obs!"} />;
  if (!reservations) return <EmptyMessage message={t("No reservations found")} />;
  return (
    <ScrollArea className="  overflow-y-auto h-full">
      <div className={"flex items-center gap-2 "}>
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
              return <SelectItem key={name} value={name}>{t(name)}</SelectItem>;
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
