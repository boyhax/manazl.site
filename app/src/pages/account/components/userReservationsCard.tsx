"use client";

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
import { useMemo } from "react";
import { Link } from "react-router-dom";

type Reservation = {
  title: string;
  dates: string;
  state: string;
  thumbnail: string;
};
function getDatesString(start, end) {
  return `${format(new Date(start), "dd MMM")} - ${format(new Date(end), "dd MMM")}`;
}
export default function ({ reservationsloaded,viewallLink }) {
  const reservations = useMemo<Reservation[]>(() => {
    return reservationsloaded
      ? reservationsloaded.map((r) => ({
          title: r.listing.title,
          dates: getDatesString(r.start_date, r.end_date),
          state: r.state,
          thumbnail: r.listing.images?r.listing.images[0]:null,
        }))
      : [];
  }, reservationsloaded);

  console.log("reservations :>> ", reservations);

  function getVariant(state: string): "default" | "destructive" | "outline" | "secondary" | "danger" | "success" {
    switch (state.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg md:text-xl">New Reservations</CardTitle>
          <CardDescription>Latest booking requests</CardDescription>
        </div>
        <Link to={viewallLink}>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {reservations.map((reservation, index) => (
            <li key={index} className="flex items-center space-x-3">
              <img
                src={reservation.thumbnail}
                alt={reservation.title}
                className="h-10 w-10 object-cover rounded-full"
              />
              <div className="flex-1 min-w-0 ps-2">
                <p className="font-medium text-sm md:text-base truncate">
                  {reservation.title}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {reservation.dates}
                </p>
              </div>
              <Badge
                variant={getVariant(reservation.state) }
              >
                {reservation.state}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
