import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { BiCalendar, BiDollar } from "react-icons/bi";
import { BOOKINGSTATES } from "src/lib/db/bookings";
import supabase from "src/lib/supabase";

export default function HostReservationTableView({ data }) {
  const { t } = useTranslate();
  const [toast] = useIonToast()
  const [reservations, setReservations] = useState(data);

  const handleStateChange = async (id: string, newState) => {
    const { error } = await supabase
      .from("reservations")
      .update({ state: newState })
      .eq("id", id);

    !error &&
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, state: newState }
            : reservation
        )
      );
    error && toast("Change Not Done Error =>" + error.message, 1000);
  };

  return (
    <div className="overflow-x-auto w-full  h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>State</TableHead>
            <TableHead>User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations
            ? reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">
                  {reservation.title}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <BiCalendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {reservation.start_Date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <BiCalendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {reservation.end_date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <BiDollar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {reservation.total_pay.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={reservation.state}
                    onValueChange={(value) =>
                      handleStateChange(reservation.id, value)
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>{reservation.state}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {BOOKINGSTATES.map((name) => {
                        return (
                          <SelectItem value={name}>{t(name)}</SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={reservation.user.avatar_url}
                        alt={reservation.user.full_name}
                      />
                      <AvatarFallback>
                        {reservation.user.full_name}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {reservation.user.full_name}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
