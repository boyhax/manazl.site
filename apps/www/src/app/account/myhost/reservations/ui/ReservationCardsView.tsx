import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslate } from "@tolgee/react";
import Link from "next/link";
import { useState } from "react";
import { BiCalendar, BiDollar } from "react-icons/bi";
import { MdChatBubble } from "react-icons/md";
import { Button } from "src/components/ui/button";
import { BOOKINGSTATES } from "src/lib/db/bookings.types";
import supabase from "src/lib/supabase";

export default function ReservationCardsView({ data }: any) {

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 h-full px-6 sm:px-3 ">
      {data.map((reservation: any) => (
        <ReservationCard
          key={"reservation-" + reservation.id}
          data={reservation}
        />
      ))}
    </div>


  );
}
function ReservationCard({ data }: any) {
  const [reservation, setReservation] = useState(data);
  const { t } = useTranslate();

  const handleStateChange = async (newState: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ state: newState })
      .eq("id", data.id);

    !error && setReservation({ ...reservation, state: newState });

    error && console.log("error :>> ", error);
    // error && toast("Change Not Done Error =>" + error.message, 1000);
  };
  return (
    <Card key={reservation.id} className="p-4">
      <div className="flex flex-col space-y-2">
        {/* <Link href={String(reservation.id)}> */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{reservation.title}</h3>
        </div>
        {/* </Link> */}
        <div className="flex items-center text-sm text-muted-foreground">
          <BiCalendar className="mr-2 h-4 w-4" />
          <span>
            {reservation.start_date} - {reservation.end_date}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <BiDollar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{Number(reservation.total_pay).toFixed(2)}</span>
        </div>
        {reservation.cancel_request && reservation.cancel_request.length > 0 ? (
          <div className="mb-4 p-2 bg-red-100 rounded-lg text-sm">
            <p className="text-red-700">
              <strong>{t("Cancelation Request")}:</strong>
            </p>
            <p className="text-red-700">
              {reservation.cancel_request[0].cancel_reason}
            </p>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <div className={"flex items-center "}>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={reservation.user.avatar_url}
                alt={reservation.user.full_name}
              />
              <AvatarFallback>{reservation.user.full_name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{reservation.user.full_name}</span>
            <Link href={`/chat?with=${reservation?.user_id}`}>
              <Button variant="outline" size="sm">
                <MdChatBubble />
              </Button>
            </Link>
          </div>
          <Select
            value={reservation.state}
            onValueChange={(value) => handleStateChange(value)}
          >
            <SelectTrigger className="w-[130px] ">
              <SelectValue>{t(reservation.state)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {BOOKINGSTATES.map((name) => {
                return <SelectItem key={name} value={name}>{t(name)}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
