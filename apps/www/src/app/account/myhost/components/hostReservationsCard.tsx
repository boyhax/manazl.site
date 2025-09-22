"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

type Reservation = {
  guest: string;
  dates: string;
  status: string;
  avatar: string;
};
function getDatesString(start: Date, end: Date) {
  return `${format(new Date(start), "dd MMM")} - ${format(new Date(end), "dd MMM")}`;
}
export default function HostReservationsCard({ reservationsloaded, viewallLink }: any) {
  const reservations = useMemo<Reservation[]>(() => {
    return reservationsloaded
      ? reservationsloaded.map((r: any) => ({
        guest: r.user.full_name,
        dates: getDatesString(r.start_date, r.end_date),
        status: r.state,
        avatar: r.user.avatar_url,
      }))
      : [];
  }, reservationsloaded);

  console.log("reservations :>> ", reservations);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg md:text-xl">New Reservations</CardTitle>
          <CardDescription>Latest booking requests</CardDescription>
        </div>
        <Link href={viewallLink}>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {reservations.map((reservation, index) => (
            <li key={index} className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={reservation.avatar} alt={reservation.guest} />
                <AvatarFallback>{reservation.guest[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 ps-2">
                <p className="font-medium text-sm md:text-base truncate">
                  {reservation.guest}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {reservation.dates}
                </p>
              </div>
              <Badge
                variant={reservation.status === "new" ? "default" : "secondary"}
              >
                {reservation.status}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
