'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/components/ui/alert-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { format, formatRelative } from "date-fns";
import { Calendar, DollarSign, Home } from "lucide-react";
import { useState } from "react";
import ReviewWriter from "src/components/ReviewWriter";
import { EmptyMessage, ErrorMessage } from "src/components/errorMessage";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "src/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { ScrollArea } from "src/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import useSearchfilter from "src/hooks/useSearchFilter";
import { cancel_booking } from "src/lib/db/bookings";
import supabase from "src/lib/supabase";
import { useCurrency } from "src/hooks/useCurrency";
import { MdChatBubble } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";

const BOOKINGSTATES = ["pending", "confirmed", "cancelled", "completed"];
type BookingStates = "pending" | "confirmed" | "cancelled" | "completed";

function getVariant(
  state: string
): "default" | "destructive" | "outline" | "secondary" {
  switch (state.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "default";
    case "cancelled":
      return "destructive";
    case "completed":
      return "secondary";
    default:
      return "outline";
  }
}
// Add this query function outside of the component
const fetchBookings = async (
  filterState?: string,
  filterType?: string
) => {
  const client = createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw Error('user_not_found')
  let query = supabase

    .from("reservations")
    .select(
      "*,user:profiles(avatar_url,full_name),cancel_request:reservation_cancel_request(id,cancel_reason),listing:listings!inner(thumbnail,title,id,user_id)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filterState) {
    query = query.eq("state", filterState);
  }

  const { data, error } = await query;
  if (error) throw Error(error.message);
  return data;
};

export default function UserReservationsView() {
  const [reviewListingId, setReviewListingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslate();
  const router = useRouter()
  const { filter, updateFilter } = useSearchfilter<{ state: string | undefined, type: string | undefined }>();
  const queryClient = useQueryClient();
  const { converted, currency } = useCurrency()
  const {
    data: bookings,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userReservations", filter.state, filter.type],
    queryFn: () => fetchBookings(filter.state, filter.type),

  });

  console.log("bookings :>> ", bookings);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await cancel_booking(bookingId);
      if (error) {
        toast({
          title: "Error",
          description:
            "Failed to cancel booking. Please try again. check error " +
            error.message,
          variant: "destructive",
        });
        console.log("error :>> ", error);

        return;
      }
      queryClient.setQueryData(
        ["userReservations",],
        (oldData: any) =>
          oldData.map((booking: any) =>
            booking.id === bookingId
              ? { ...booking, state: "cancelled" }
              : booking
          )
      );

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <BookingsSkeletonLoader />;
  if (error) return <ErrorMessage message={(error as Error).message} />;

  return (
    <ScrollArea className="">
      <div className={"flex items-center gap-2 my-2"}>
        <Select
          value={filter.state || "all"}
          onValueChange={(value) =>
            updateFilter({ state: value == "all" ? undefined : value })
          }
        >
          <SelectTrigger className="w-[130px] bg-secondary">
            <SelectValue>
              {filter.state ? t(filter.state) : t("state")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {["all", ...BOOKINGSTATES].map((name) => {
              return (
                <SelectItem key={name} value={name}>
                  {t(name)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

      </div>
      {!bookings ||
        (bookings.length === 0 && <EmptyMessage message={t("No reservations found")} />)}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-6">
        {bookings ? bookings.map((booking) => (
          <Card
            key={booking.id}
            className="overflow-hidden  md:mx-4 lg:mx-2"
          >
            <CardHeader className="p-0">
              <div className="relative h-48">
                <Image
                  width={500} height={200}
                  src={booking.listing.thumbnail}
                  alt={booking.listing.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={getVariant(booking.state)}
                >
                  {booking.state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2">{booking.listing.title}</CardTitle>

              <p className="text-sm text-gray-500">
                {t("refrence number ")}
                {booking.id}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Check-in:{" "}
                    {format(new Date(booking.start_date), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Check-out:{" "}
                    {format(new Date(booking.end_date), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Total: {currency}{converted(booking.total_pay, '$')} </span>
                </div>
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  <span>
                    Booked{" "}
                    {formatRelative(new Date(booking.created_at), new Date())}
                  </span>
                </div>
              </div>
              {booking.cancel_request && booking.cancel_request.length > 0 ? (
                <div className="mb-4 p-3 bg-red-100 rounded-lg my-3 text-sm">
                  <p className="text-red-700">
                    <strong>
                      {booking.state == "cancelled"
                        ? t("reservation cancelled")
                        : t("Cancelation Request Send but not Accepted yet")}
                      :
                    </strong>
                  </p>
                  <p className="text-red-700">
                    <strong>{t("Cancelation Reason")}:</strong>{" "}
                    {booking.cancel_request[0].cancel_reason}
                  </p>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  (router.push(`/account/reservations/${booking.id}`))
                }
              >
                {t("View Details")}
              </Button>

              {(booking.state == "pending" ||
                !(
                  booking.cancel_request && booking.cancel_request.length > 0
                )) &&
                booking.state == "confirmed" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        {t("Cancel Booking")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t(`This action cannot be undone. This will permanently
                            cancel your booking.`)}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          {t("Confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              {booking.state === "completed" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setReviewListingId(booking.listing.id)}
                    >
                      {t(" Write Review")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("Write a Review")}</DialogTitle>
                    </DialogHeader>
                    <ReviewWriter
                      listing_id={reviewListingId!}
                      onSubmit={() => setReviewListingId(null)}
                      onFail={() => setReviewListingId(null)}
                    />
                  </DialogContent>
                </Dialog>
              )}
              <Link href={`/chat?with=${booking.listing.user_id}`}>
                <Button variant="outline" size="sm">
                  <MdChatBubble />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )) : null}
      </div>
    </ScrollArea>
  );
}


function BookingsSkeletonLoader() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
