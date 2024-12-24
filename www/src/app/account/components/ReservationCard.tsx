
'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserContext } from "@/providers/userProvider";
import { useTranslate } from "@tolgee/react";
import { format } from "date-fns";
import Link from "next/link";


function getDatesString(start: Date, end: Date) {
  return `${format(new Date(start), "dd MMM")} - ${format(new Date(end), "dd MMM")}`;
}
export default function ReservationCard({
  reservation: {
    id,
    user_id,
    user: { full_name: guest, avatar_url: avatar },
    listing: { title },
    start_date,
    end_date,
    state,
  },
}: any) {
  const { user } = useUserContext();
  const { t } = useTranslate();
  return (
    <Link href={`/account/bookings/${id}`}>
      <li className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar} alt={guest} />
          <AvatarFallback>{guest ? guest[0] : "G"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 ps-2">
          {user && user_id == user.id ? (
            <Badge>
              {t("You")}
            </Badge>
          ) : null}
          <p className="font-medium text-sm md:text-base truncate">{guest}</p>

          <p className="text-xs md:text-sm text-muted-foreground truncate">
            {getDatesString(start_date, end_date)}
          </p>
        </div>
        <Badge variant={state === "new" ? "default" : "secondary"}>
          {t(state)}
        </Badge>
      </li>
    </Link>
  );
}
