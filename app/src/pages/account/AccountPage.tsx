import { IonContent, IonProgressBar, useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { format } from "date-fns";
import { Bell, Calendar, Heart, Home, Settings, User } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Page from "src/components/Page";
import useProfile from "src/hooks/useProfile";
import useSearchfilter from "src/hooks/useSearchFilter";
import { getuserid } from "src/lib/db/auth";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import ReservationCard from "./components/ReservationCard";
import { BecomeHostCard, HostListingCard } from "./components/hostListings";

const reservationSelect =
  "created_at,id,user_id,state,start_date,end_date,total_pay,listing:listings!inner(title,host:user_id), user:profiles!inner(full_name,avatar_url)";

async function accountLoader() {
  const id = await getuserid();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `listings(id,title,created_at,images,rating,variants(title,type,id,active),reservations(${reservationSelect})),reservations(${reservationSelect}),likes(count),notifications(count)`
    )
    .eq("id", id)
    .limit(5, { referencedTable: "listings.reservations" })
    .limit(5, { referencedTable: "reservations" })
    .gte('reservations.start_date', new Date().toDateString())
    .gte('listings.reservations.start_date', new Date().toDateString())
    .order("created_at", { ascending: false, referencedTable: "reservations" })
    .order("created_at", {
      ascending: false,
      referencedTable: "listings.reservations",
    })
    .single();
  if (error) throw Error(error.message);

  return data;
}

export default function AccountPage() {
  const user = auth((s) => s.user);
  // const { data, loading, error } = useFetch(accountLoader);
  const { data, isLoading, error } = useQuery({
    queryKey: ["account", user.id],
    queryFn: accountLoader,
    enabled: !!user,
  });
  const { filter, setFilter } = useSearchfilter<{ view: string | undefined }>();
  const [name, setName] = useState(user.full_name);
  const view = filter.view || "overview";

  const [reservationsSection, setreservationsSection] = useState<
    "self" | "host" | "all"
  >("all");
  const avatarUrl = user ? user.avatar_url : "https://i.pravatar.cc/80?img=3";
  const { updateAvatar, updateProfile } = useProfile();
  const [toast] = useIonToast();
  const { t } = useTranslate();
  const userLikedListingsCount = data && data.likes ? data.likes[0].count : 0;
  const userNotificationsCount =
    data && data.notifications ? data.notifications[0].count : 0;
  const userReservations = data ? data?.reservations : [];
  const listingReservations =
    data && data?.listings && data.listings.length > 0
      ? data.listings[0].reservations
      : [];

  function filerreservation(reservation) {
    return reservationsSection == "host"
      ? reservation.user_id != user.id
      : reservationsSection == "self"
        ? reservation.user_id == user.id
        : true;
  }
  var reservations = [
    ...(userReservations || []),
    ...(listingReservations || []),
  ].filter(filerreservation);

  console.log("data,error :>> ", data, error);
  function handleProfileSave() {
    if (name && name.length > 5) {
      updateProfile({ full_name: name });
      toast("Profile updated successfully", 2000);
    } else {
      toast("Name should be more than 5 characters", 2000);
    }
  }

  if (isLoading) return <IonProgressBar type="indeterminate" />;

  const isHost = data && data.listings && data.listings.length > 0;

  return (
    <Page>
      <IonContent>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 max-w-md mx-auto">
          <div className="container mx-auto p-4 space-y-6">
            <header className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback>
                    {(name || "ma").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={"ps-2"}>
                  <h1 className="text-2xl font-bold ">{name}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Joined")}{" "}
                    {format(new Date((user as any).created_at), "MMMM yyyy")}
                  </p>
                </div>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    {t("Edit Profile")}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t("Edit Profile")}</SheetTitle>
                    <SheetDescription>
                      {t("Make changes to your profile here")}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("Name")}</Label>
                      <Input
                        id="name"
                        value={name}
                        maxLength={20}
                        onChange={(e) => setName(e.target.value.slice(0, 20))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar</Label>
                      <div className="flex space-x-2">
                        <Button
                          onClick={updateAvatar}
                          size="icon"
                          variant="outline"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback>
                              {(name || "ma").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={handleProfileSave} type="submit">
                        {t("Save changes")}
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </header>

            <Tabs
              defaultValue="overview"
              value={view}
              onValueChange={(v) => setFilter({ view: v })}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 lg:w-1/2 mx-auto">
                <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
                <TabsTrigger value="reservations">
                  {t("Reservations")}
                </TabsTrigger>
                <TabsTrigger value="listings">{t("Listings")}</TabsTrigger>
                {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Account Overview")}</CardTitle>
                    <CardDescription>
                      {t("Quick summary of your account")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-4 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                        <Calendar className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-semibold">
                            {userReservations?.length || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("Upcoming Reservations")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                        <Home className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="font-semibold">
                            {data.listings?.length || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("Active Listings")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                        <User className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="font-semibold">
                            {isHost ? "Host" : "Guest"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("Account Type")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                        <Heart className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="font-semibold">
                            {userLikedListingsCount}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("Liked Listings")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                        <Bell className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-semibold">
                            {userNotificationsCount}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("Notifications")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reservations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div>
                      <div className={`flex space-x-4`}>
                        <CardTitle
                          className={
                            reservationsSection == "all"
                              ? " border-b-2 pb-1 border-foreground"
                              : "text-muted-foreground"
                          }
                          onClick={() => setreservationsSection("all")}
                        >
                          {t("All Reservations")}
                        </CardTitle>
                        <CardTitle
                          className={
                            reservationsSection == "self"
                              ? " border-b-2 pb-1 border-foreground"
                              : "text-muted-foreground"
                          }
                          onClick={() => setreservationsSection("self")}
                        >
                          {t("Your Reservations")}
                        </CardTitle>
                        <CardTitle
                          className={
                            reservationsSection == "host"
                              ? " border-b-2 pb-1 border-foreground"
                              : "text-muted-foreground"
                          }
                          onClick={() => setreservationsSection("host")}
                        >
                          {t("Other reservations")}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        {t("Upcoming bookings")}
                      </CardDescription>
                    </div>
                    <Link to={"/reservations"}>
                      <Button variant="ghost" size="sm">
                        {t("View all")}
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {!!reservations ? (
                      <ul className="space-y-3">
                        {reservations.map((reservation, i) => {
                          return (
                            <ReservationCard
                              key={"reservationcard" + i}
                              reservation={reservation as any}
                            />
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400">
                        {t("No reservations found.")}
                      </p>
                    )}
                  </CardContent>
                </Card>

              </TabsContent>

              <TabsContent value="listings" className="space-y-6">
                {isHost ? (
                  data.listings.map((listing) => (
                    <HostListingCard key={listing.id} listing={listing} />
                  ))
                ) : (
                  <BecomeHostCard />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </IonContent>
      <div className={"pb-16"} />
    </Page>
  );
}
