import { IonContent, IonProgressBar, useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { format, formatDistance } from "date-fns";
import { Bell, Calendar, Heart, Home, Settings, User, AlertCircle } from "lucide-react";
import { useState } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["account", user.id],
    queryFn: accountLoader,
    enabled: !!user,
  });
  const { filter, setFilter } = useSearchfilter<{ view: string | undefined }>();
  const [name, setName] = useState(user.full_name);
  const view = filter.view || "overview";
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

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

  function handleProfileSave() {
    if (name && name.length > 5) {
      updateProfile({ full_name: name });
      toast({
        message: t("Profile updated successfully"),
        duration: 2000,
        position: "bottom",
        color: "success"
      });
    } else {
      toast({
        message: t("Name should be at least 5 characters"),
        duration: 2000,
        position: "bottom",
        color: "warning"
      });
    }
  }

  const isHost = data && data.listings && data.listings.length > 0;

  // Fetch notifications
  useState(() => {
    async function fetchNotifications() {
      if (!user || !user.id) return;
      
      try {
        setNotificationsLoading(true);
        const { data: notificationData, error } = await supabase
          .from("notifications")
          .select("*")
          .limit(10)
          .order("created_at", { ascending: false })
          .eq("user_id", user.id);
          
        if (!error && notificationData) {
          setNotifications(notificationData);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setNotificationsLoading(false);
      }
    }
    
    fetchNotifications();
  }, [user]);

  // Account stat badges data
  const statBadges = [
    {
      label: t("Upcoming Reservations"),
      value: userReservations?.length || 0,
      icon: <Calendar className="h-4 w-4 mr-1" />,
      color: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      href: "/reservations"
    },
    {
      label: t("Active Listings"),
      value: data?.listings?.length || 0,
      icon: <Home className="h-4 w-4 mr-1" />,
      color: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      href: "/account?view=listings"
    },
    {
      label: t("Account Type"),
      value: isHost ? t("Host") : t("Guest"),
      icon: <User className="h-4 w-4 mr-1" />,
      color: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      href: "#"
    },
    {
      label: t("Liked Listings"),
      value: userLikedListingsCount,
      icon: <Heart className="h-4 w-4 mr-1" />,
      color: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      href: "#"
    },
    {
      label: t("Notifications"),
      value: userNotificationsCount,
      icon: <Bell className="h-4 w-4 mr-1" />,
      color: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      href: "/account/notifications"
    }
  ];

  const markAsRead = async (notificationId) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ received: true })
        .eq("id", notificationId);
      
      if (error) throw error;
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, received: true } 
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.received) {
      markAsRead(notification.id);
    }
    
    // Navigate if URL exists
    if (notification.url) {
      navigate(notification.url);
    }
  };

  return (
    <Page>
      <IonContent>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 mx-auto">
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
                   <span className="hidden sm:block"> {t("Edit Profile")}</span> 
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
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="mb-6">
                  <ScrollArea className="w-full whitespace-nowrap pb-3">
                    <div className="flex w-max space-x-4 p-1">
                      {statBadges.map((badge, index) => (
                        <Link to={badge.href} key={index}>
                          <div className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${badge.color}`}>
                            {badge.icon}
                            <span className="mr-1">{badge.value}</span>
                            <span>{badge.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        {t("Recent Notifications")}
                      </CardTitle>
                      <CardDescription>
                        {t("Your latest updates and notifications")}
                      </CardDescription>
                    </div>
                    <Link to="/account/notifications">
                      <Button variant="outline" size="sm">
                        {t("View all")}
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {notificationsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-4 p-3 rounded-lg border">
                            <Skeleton className="h-2 w-2 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-1/2" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : notifications && notifications.length > 0 ? (
                      <div className="grid gap-4">
                        {notifications.map((notification, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg cursor-pointer ${
                              !notification.received ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800/50"
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="grid grid-cols-[25px_1fr] items-start gap-3">
                              <div className="relative mt-1">
                                <span className={`flex h-2 w-2 rounded-full ${
                                  !notification.received ? "bg-blue-500" : "bg-gray-300"
                                }`} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {notification.body}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistance(
                                    new Date(notification.created_at),
                                    new Date(),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">{t("No notifications to display")}</p>
                      </div>
                    )}
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
    </Page>
  );
}
