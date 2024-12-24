import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { useTranslate } from "@tolgee/react";
import { format } from "date-fns";
import { CalendarFold, Edit, Plus, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import HostReservationsCard from "./hostReservationsCard";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import Room_availabilty_sheet from "src/pages/host/variant/room_availabilty_sheet";

interface Variant {
  id: string;
  title: string;
  type: string,
  active: boolean;
}

interface Listing {
  id: string;
  title: string;
  images: string[];
  created_at: string;
  variants: Variant[];
  rating: number;
  reservations: any[];
}

interface HostListingsProps {
  isHost: boolean;
  data: {
    data: {
      listings: Listing[];
    };
  };
}

export function HostListings({ isHost, data }: HostListingsProps) {
  const { t } = useTranslate();

  return (
    <TabsContent value="listings" className="space-y-6">
      {isHost ? (
        data.data.listings.map((listing) => (
          <HostListingCard key={listing.id} listing={listing} />
        ))
      ) : (
        <BecomeHostCard />
      )}
    </TabsContent>
  );
}

export function HostListingCard({ listing }: { listing: Listing }) {
  const { t } = useTranslate();

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{listing.title}</CardTitle>
          <Link to={`/account/myhost`}>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              <span className="sr-only md:not-sr-only">{t("Edit")}</span>
            </Button>
          </Link>
        </div>
        <CardDescription>
          {t("Manage your listing and reservations")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <HostDetailsCard listing={listing} />
        <VariantsTable variants={listing.variants} listingId={listing.id} />
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("Reservations")}</h3>
          <HostReservationsCard
            viewallLink={"/reservations/host"}
            reservationsloaded={listing.reservations}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function HostDetailsCard({ listing }: { listing: Listing }) {
  const { t } = useTranslate();

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col space-y-4">
          <img
            src={listing.images ? listing.images[0] : "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="space-y-2">
            <Label className="text-lg font-semibold">{listing.title}</Label>
            <p className="text-sm text-muted-foreground">
              {t("Created at")}{" "}
              {format(new Date(listing.created_at), "dd MMM yy")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">{t("Total Variants")}</p>
            <p className="text-xl font-bold">
              {listing.variants ? listing.variants.length : t("No variants")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("Overall Rating")}</p>
            <p className="text-xl font-bold">
              {(listing.rating / 20).toFixed(2)} ⭐
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VariantsTable({
  variants,
  listingId,
}: {
  variants: Variant[];
  listingId: string;
}) {
  const [_variants, set_variants] = useState(variants);
  const { t } = useTranslate();

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg">{t("Variants")}</CardTitle>
        <Link to={`/account/variant`}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t("Add Variant")}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {!_variants || _variants.length < 1 ? <Alert>
          <AlertTitle>{t("Kindly be warned!")}</AlertTitle>
          <AlertDescription >{t("Without options, customers will be unable to make reservations.")}</AlertDescription>
        </Alert> : null}
        <ScrollArea className="h-[300px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Title")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("dates")}</TableHead>
                <TableHead>{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {_variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-medium">{variant.title}</TableCell>
                  <TableCell>
                    <Badge variant={variant.active ? "default" : "secondary"}>
                      {variant.active ? t("Active") : t("Inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Room_availabilty_sheet room_id={variant.id}>
                      <Button size="sm" variant="ghost">
                        <CalendarFold className="h-4 w-4 mr-2" />
                      </Button>
                    </Room_availabilty_sheet>
                  </TableCell>
                  <TableCell>
                    <Link to={`/account/variant/${variant.id}`}>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4 mr-2" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BecomeHostCard() {
  const { t } = useTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Become a Host")}</CardTitle>
        <CardDescription>
          {t("Start your journey as a host and earn extra income")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t(
            "Hosting on our platform is easy and rewarding. You can share your space, meet new people, and earn money."
          )}
        </p>
        <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
          <li>{t("List your space for free")}</li>
          <li>{t("Set your own schedule and prices")}</li>
          <li>{t("Welcome guests from around the world")}</li>
        </ul>
        <Link to="/account/myhost">
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t("Make Your Listing")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
