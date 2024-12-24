'use client'
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
import { useTranslate } from "@tolgee/react";
import { format } from "date-fns";
import { CalendarFold, Edit, Plus, Settings } from "lucide-react";

import HostReservationsCard from "./hostReservationsCard";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import Room_availabilty_sheet from "./room_availabilty_sheet";

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





export default function HostSammaryCard({ listing }: { listing: Listing }) {
  const { t } = useTranslate();
  const isNoVariants = listing?.variants?.length <= 0
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{listing.title}</CardTitle>
          <Link href={`/account/myhost/update`}>
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
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col space-y-4">
              <Image
                src={listing.images ? listing.images[0] : "/placeholder.svg"}
                alt={listing.title}
                width={600} height={250}
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
        <Card>
          <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">{t("Variants")}</CardTitle>
            <Link href={`/account/myhost/variant`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Variant")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isNoVariants ? <Alert>
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
                  {listing.variants.map((variant) => (
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
                        <Link href={`/account/myhost/variant/${variant.id}`}>
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
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("Reservations")}</h3>
          <HostReservationsCard
            viewallLink={"/account/myhost/reservations"}
            reservationsloaded={listing.reservations}
          />
        </div>
      </CardContent>
    </Card>
  );
}

