// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   IonContent,
//   IonProgressBar,
//   IonToggle,
//   useIonToast,
// } from "@ionic/react";
// import { useTranslate } from "@tolgee/react";
// import { format } from "date-fns";
// import { Edit, Plus } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import useFetch from "src/hooks/useFetch";
// import useProfile from "src/hooks/useProfile";
// import { getuserid } from "src/lib/db/auth";
// import supabase from "src/lib/supabase";
// import { auth } from "src/state/auth";
// import ReservationsCard from "../account/components/reservationsCard";
// import HostCard from "../account/components/hostCard";


// function Switch({ ...props }) {
//   return <IonToggle {...props}></IonToggle>;
// }

// async function accountLoader() {
//   const id = await getuserid();
//   const { data, error } = await supabase
//     .from("profiles")
//     .select(
//       "*,listings(id,title,created_at,images,rating,cost,variants(count),reservations(*,user:profiles(full_name))),reservations(*,user:profiles(full_name),listings(title,variants(title)))"
//     )
//     .eq("id", id)
//     .limit(3, { referencedTable: 'listings.reservations', })
//     .single();
//   return { data, error };
// }

// export default function () {
//   const { user } = auth();
//   const { data, loading, error } = useFetch(accountLoader);
//   const [name, setName] = useState(
//     user ? user.full_name : "User" + (user ? user.id.slice(0, 5) : "anon")
//   );
//   const avatarUrl = user ? user.avatar_url : "https://i.pravatar.cc/80?img=3";
//   const { updateAvatar, updateProfile } = useProfile();
//   const [toast] = useIonToast();
//   const { t } = useTranslate();

//   function handleProfileSave() {
//     if (name && name.length > 5) {
//       updateProfile({ full_name: name });
//     } else {
//       toast("Name should be more than 5 characters", 1000);
//     }
//   }

//   if (loading) return <IonProgressBar type="indeterminate" />;
//   if (error || (data && data.error)) throw new Error(error || data.error);

//   const isHost = data && data.data.listings && data.data.listings.length > 0;
//   const userReservations = data && data.data.reservations;

//   return (
//     <IonContent>
//       <div className="container mx-auto p-4 space-y-4 md:space-y-6 pb-20">
//         <div className="flex justify-between items-center mb-4 md:mb-6">
//           <h1 className="text-2xl md:text-3xl font-bold">Account</h1>
//         </div>

//         <div className="space-y-4 md:space-y-6">
//           {/* User Details Card */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg md:text-xl">
//                 {t("User Details")}
//               </CardTitle>
//               <CardDescription>{t("Your account information")}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center space-x-4">
//                 <Avatar className="h-16 w-16 md:h-20 md:w-20">
//                   <AvatarImage src={avatarUrl} alt="User" />
//                   <AvatarFallback>
//                     {name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <h2 className="text-xl md:text-2xl font-semibold ms-2">
//                     {name.slice(0, 20)}
//                   </h2>
//                   <p className="text-sm text-muted-foreground">
//                     Joined {format(new Date((user as any).created_at), "MMMM yyyy")}
//                   </p>
//                 </div>
//                 <Sheet>
//                   <SheetTrigger asChild>
//                     <Button size="sm">
//                       <Edit className="h-4 w-4 mr-2" />
//                       Edit Profile
//                     </Button>
//                   </SheetTrigger>
//                   <SheetContent>
//                     <SheetHeader>
//                       <SheetTitle>Edit Profile</SheetTitle>
//                       <SheetDescription>
//                         Make changes to your profile here
//                       </SheetDescription>
//                     </SheetHeader>
//                     <div className="py-4 space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="name">Name</Label>
//                         <Input
//                           id="name"
//                           value={name}
//                           maxLength={20}
//                           onChange={(e) => setName(e.target.value.slice(0, 20))}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="avatar">Avatar</Label>
//                         <div className="flex space-x-2">
//                           <Button
//                             onClick={updateAvatar}
//                             size="icon"
//                             variant="outline"
//                           >
//                             <Avatar className="h-10 w-10 md:h-20 md:w-20">
//                               <AvatarImage src={avatarUrl} alt="User" />
//                               <AvatarFallback>
//                                 {name
//                                   .split(" ")
//                                   .map((n) => n[0])
//                                   .join("")}
//                               </AvatarFallback>
//                             </Avatar>
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                     <SheetFooter>
//                       <SheetClose asChild>
//                         <Button onClick={handleProfileSave} type="submit">
//                           Save changes
//                         </Button>
//                       </SheetClose>
//                     </SheetFooter>
//                   </SheetContent>
//                 </Sheet>
//               </div>
//             </CardContent>
//           </Card>

//           {/* User Reservations Card */}
//           {userReservations && userReservations.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg md:text-xl">
//                   {t("Your Reservations")}
//                 </CardTitle>
//                 <CardDescription>{t("Upcoming and past bookings")}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ReservationsCard reservationsloaded={userReservations}  />
//               </CardContent>
//             </Card>
//           )}

//           {/* Host Listings and Reservations */}
//           {isHost ? (
//             data.data.listings.map((listing) => (
//               <div key={listing.id} className="space-y-4">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <div>
//                       <CardTitle className="text-lg md:text-xl">
//                         {listing.title}
//                       </CardTitle>
//                       <CardDescription>
//                         {t("Manage your listing and reservations")}
//                       </CardDescription>
//                     </div>
//                     <Link to={`/account/host/edit/${listing.id}`}>
//                       <Button size="sm" variant="outline">
//                         <Edit className="h-4 w-4 mr-2" />
//                         Edit Listing
//                       </Button>
//                     </Link>
//                   </CardHeader>
//                   <CardContent>
//                     <HostCard listing={listing} />
//                     <div className="mt-4">
//                       <h3 className="text-lg font-semibold mb-2">{t("Reservations for this listing")}</h3>
//                       <ReservationsCard reservationsloaded={listing.reservations}  />
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             ))
//           ) : (
//             // Make Your Listing Card for non-hosts
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg md:text-xl">
//                   Become a Host
//                 </CardTitle>
//                 <CardDescription>
//                   {t("Start your journey as a host and earn extra income")}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <p className="text-sm text-muted-foreground">
//                   {t(`Hosting on our platform is easy and rewarding. You can share
//                   your space, meet new people, and earn money.`)}
//                 </p>
//                 <ul className="list-disc list-inside text-sm space-y-1">
//                   <li>{t("List your space for free")}</li>
//                   <li>{t("Set your own schedule and prices")}</li>
//                   <li>{t("Welcome guests from around the world")}</li>
//                 </ul>
//                 <Link to="/account/host/create">
//                   <Button className="w-full mt-4">
//                     <Plus className="h-4 w-4 mr-2" />
//                     {t("Make Your Listing")}
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </IonContent>
//   );
// }



import { useState } from "react";
import { format } from "date-fns";
import { useTranslate } from "@tolgee/react";
import { Link } from "react-router-dom";
import { IonContent, IonProgressBar, useIonToast } from "@ionic/react";
import { Edit, Plus, Calendar, Home, User, Settings, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useFetch from "src/hooks/useFetch";
import useProfile from "src/hooks/useProfile";
import { getuserid } from "src/lib/db/auth";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import HostCard from "../account/components/hostCard";
import ReservationsCard from "../account/components/hostReservationsCard";


async function accountLoader() {
  const id = await getuserid();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "*,listings(id,title,created_at,images,rating,cost,variants(count),reservations(*,user:profiles(full_name))),reservations(*,user:profiles(full_name),listings(title,variants(title)))"
    )
    .eq("id", id)
    .limit(3, { referencedTable: 'listings.reservations', })
    .single();
  return { data, error };
}

export default function AccountPage() {
  const { user } = auth();
  const { data, loading, error } = useFetch(accountLoader);
  const [name, setName] = useState(
    user ? user.full_name : "User" + (user ? user.id.slice(0, 5) : "anon")
  );
  const avatarUrl = user ? user.avatar_url : "https://i.pravatar.cc/80?img=3";
  const { updateAvatar, updateProfile } = useProfile();
  const [toast] = useIonToast();
  const { t } = useTranslate();

  function handleProfileSave() {
    if (name && name.length > 5) {
      updateProfile({ full_name: name });
      toast("Profile updated successfully", 2000);
    } else {
      toast("Name should be more than 5 characters", 2000);
    }
  }

  if (loading) return <IonProgressBar type="indeterminate" />;
  if (error || (data && data.error)) throw new Error(error || data.error);

  const isHost = data && data.data.listings && data.data.listings.length > 0;
  const userReservations = data && data.data.reservations;

  return (
    <IonContent>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto p-4 space-y-6">
          <header className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Joined {format(new Date((user as any).created_at), "MMMM yyyy")}
                </p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Profile</SheetTitle>
                  <SheetDescription>Make changes to your profile here</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
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
                      <Button onClick={updateAvatar} size="icon" variant="outline">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarUrl} alt={name} />
                          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button onClick={handleProfileSave} type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </header>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-1/2 mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Account Overview")}</CardTitle>
                  <CardDescription>{t("Quick summary of your account")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-4 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-semibold">{userReservations?.length || 0}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Reservations</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                      <Home className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-semibold">{data.data.listings?.length || 0}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Active Listings</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                      <User className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-semibold">{isHost ? "Host" : "Guest"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reservations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Your Reservations")}</CardTitle>
                  <CardDescription>{t("Upcoming and past bookings")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {userReservations && userReservations.length > 0 ? (
                    <ReservationsCard reservationsloaded={userReservations}  />
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No reservations found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="space-y-6">
              {isHost ? (
                data.data.listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription>{t("Manage your listing and reservations")}</CardDescription>
                      </div>
                      <Link to={`/account/host/edit/${listing.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Listing
                        </Button>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <HostCard listing={listing} />
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">{t("Reservations for this listing")}</h3>
                        <ReservationsCard reservationsloaded={listing.reservations}  />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Become a Host</CardTitle>
                    <CardDescription>{t("Start your journey as a host and earn extra income")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t(`Hosting on our platform is easy and rewarding. You can share
                      your space, meet new people, and earn money.`)}
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-500 dark:text-gray-400">
                      <li>{t("List your space for free")}</li>
                      <li>{t("Set your own schedule and prices")}</li>
                      <li>{t("Welcome guests from around the world")}</li>
                    </ul>
                    <Link to="/account/host/create">
                      <Button className="w-full mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        {t("Make Your Listing")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Account Settings")}</CardTitle>
                  <CardDescription>{t("Manage your account preferences")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Email Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
                    </div>
                    {/* <Switch /> */}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    {/* <Switch /> */}
                  </div>
                  <Button variant="destructive" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </IonContent>
  );
}