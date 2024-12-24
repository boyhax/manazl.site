import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
import { addDays, differenceInDays } from "date-fns";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Map, latLng } from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Users, Bed, Home } from "lucide-react";
import {
  IonContent, IonSpinner,
  useIonToast
} from "@ionic/react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Header from "@/components/Header";
import Page, { HeaderBackButton } from "@/components/Page";
import ShareLink from "@/components/ShareLink";
import { HeaderLikeButton } from "@/components/LikeButton";
import ImageCarousel from "@/components/imageCorousol";
import ReviewsSection from "@/components/ReviewsSection";
import CommentsSection from "@/components/CommentsSection";
import { MapSetup } from "./Home/views/MapSearchView";
import { create_booking } from "@/lib/db/bookings";
import supabase from "@/lib/supabase";
import { DatePickerWithRange } from "src/components/ui/dateRangePicker";
import useRooms from "src/hooks/useRooms";
import LoadingSpinnerComponent from "react-spinners-components";
import { useQuery } from "@tanstack/react-query";
import { getChatId } from "./chat/actions/chat.server";


function get_cost(data: { listing_id: string, rooms: { total_cost: number }[] }[]) {
  let cost = null;
  data.forEach((value, index, array) => {

    value.rooms.forEach((room, index, array) => {

      if (!cost || room.total_cost < cost) {
        cost = room.total_cost
      }
    })
  })

  return cost

}

export default function ListingDetailPage() {
  const { id } = useParams();
  const [view, setview] = useState('overview');
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [toast] = useIonToast();
  const [bookingConfirming, setBookingConfirming] = useState(false);
  const [room, setRoom] = useState<{ room_id, room_type, total_cost, }>();
  const [dateRange, setDateRange] = useState({ from: new Date(), to: addDays(new Date(), 1) });
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const mapRef = useRef<Map>(null);
  const { data: listingData, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          "id,user_id,title,lat,lng,address,images,type,id,amenities,variants(*),user:listings_user_id_fkey!inner(avatar_url,full_name)"
        )
        .eq("short_id", id)
        .single()
      if (error) throw Error(error.message)
      return data
    }
  })
  const { data: roomsData, isLoading: isLoadingRooms } = useRooms({
    id: listingData ? listingData.id : "",
    checkin: getCheckin(),
    checkout: getCheckout()
  })
  function getCheckin() {
    return !!dateRange['from'] ? dateRange.from : new Date()
  }
  function getCheckout() {
    return !!dateRange['to'] ? dateRange.to : addDays(new Date(), 1)

  }
  let variant = room ? listingData?.variants.find(r => r.id == room.room_id) : undefined;

  const numberOfNights =
    dateRange.from && dateRange.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;


  const confirmBooking = async () => {
    setBookingConfirming(true);
    try {
      const { data, error } = await create_booking({
        title: `${listingData.title} - ${room.room_type}`,
        variant_id: room.room_id,
        listing_id: listingData.id,
        start_date: dateRange.from,
        end_date: addDays(dateRange.to, -1),
        total_pay: room.total_cost,
      });
      if (error) throw Error(error.message)
      navigate(`/account/bookings/${data.id}`);
    } catch (error) {
      toast({
        message: t("Booking failed. Please try again."),
        duration: 3000,
      });
      console.error("Booking error:", error);
    } finally {
      setBookingConfirming(false);
    }
  };

  if (isLoading) return <LoadingSpinnerComponent type="Infinity" />;
  if (error) throw Error(error.message)
  let cost = roomsData ? get_cost(roomsData) : null;
  return (
    <Page className="container mx-auto px-4 py-8 max-w-2xl mb-16">
      <Header>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center mb-2"
        >
          <HeaderBackButton to="/" />
          <div className="flex space-x-2">
            <ShareLink
              text={t("Check out this amazing place!")}
              url={`/listing/${id}`}
            >
              <Button variant="ghost" size="icon">
                <Share2 className="h-6 w-6" />
              </Button>
            </ShareLink>
            {listingData && <HeaderLikeButton id={listingData.id} />}
          </div>
        </motion.div>
      </Header>
      <IonContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <ImageCarousel images={listingData.images || []} />
            <motion.div
              className="flex gap-2 pt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Button onClick={() => setIsBookingOpen(true)}>
                {t("Book Now")}
              </Button>

              <Button onClick={() => {
                getChatId(listingData.id)
                  .then(({ id }) => navigate('/chat/' + id))
              }}
                variant="outline"
              >{t("Contact Host")}</Button>

            </motion.div>
          </CardHeader>

          <Tabs value={view} onValueChange={setview}>
            <TabsList className="grid w-full grid-cols-3 lg:w-1/2 mx-auto">
              <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("Reviews")}</TabsTrigger>
              <TabsTrigger value="Q&A">{t("Q & A")}</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview">
                  <CardContent>
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <CardTitle className="text-2xl font-bold mb-2">
                          {listingData.title}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {listingData.address.state +
                            " " +
                            listingData.address.city}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="flex items-center space-x-2"
                      >
                        <Badge>{listingData.type}</Badge>
                        {cost
                          ? <Badge variant="outline">
                            ${cost} / {t("nights") + " " + numberOfNights}
                          </Badge>
                          : isLoadingRooms
                            ? <LoadingSpinnerComponent size={'10px'} type="Spinner" />
                            : null}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="flex items-center space-x-2"
                      >
                        <Avatar>
                          <AvatarImage src={(listingData.user as any).avatar_url} />
                          <AvatarFallback>
                            {((listingData.user as any).full_name || 'AB')
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {t("Hosted by")} {(listingData.user as any).full_name}
                        </span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        <h3 className="font-semibold mb-2">{t("Amenities")}</h3>
                        <div className="flex flex-wrap gap-2">
                          {listingData.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <h3 className="font-semibold mb-2">{t("Location")}</h3>
                        <div className="h-48 rounded-lg overflow-hidden">
                          <Link target="_blank" to={`http://maps.google.com/maps?z=12&t=m&q=loc:${listingData.lat}+${listingData.lng}`}>

                            <MapContainer

                              ref={mapRef}
                              center={latLng(listingData.lat, listingData.lng)}
                              zoom={13}
                              scrollWheelZoom={false}
                              style={{ height: "100%", width: "100%" }}
                            >
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <Marker
                                position={latLng(
                                  listingData.lat,
                                  listingData.lng
                                )}
                              />
                              <MapSetup />
                            </MapContainer>
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="reviews">
                  <ReviewsSection listing_id={listingData.id} />
                </TabsContent>
                <TabsContent value="Q&A">
                  <CommentsSection id={listingData.id} type="listing" />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        <Sheet open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <SheetContent side="bottom" className="max-w-md mx-auto">
            <SheetHeader>
              <SheetTitle>{t("Book Your Stay")}</SheetTitle>
            </SheetHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mt-4"
            >
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />

              <Select
                onValueChange={id => {
                  setRoom(roomsData[0]?.rooms.find(r => r.room_id === id))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select room type")} />
                </SelectTrigger>
                <SelectContent>
                  {roomsData ? roomsData[0]?.rooms.map((room, key) => {
                    console.log('roomData :>> ', roomsData, room);
                    return (
                      <SelectItem key={key} value={room.room_id}>
                        {room.title}  {room.room_type}  ${room.total_cost}/{t("nights") + " " + numberOfNights}
                      </SelectItem>
                    )
                  }) : null}
                </SelectContent>
              </Select>


              {room && (
                <Card>
                  <CardHeader>
                    <CardTitle>{room.room_type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{t("Guests")}</span>
                        <span>
                          {variant.guests}{" "}
                          <Users className="inline h-4 w-4" />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t("Rooms")}</span>
                        <span>
                          {variant.rooms}{" "}
                          <Home className="inline h-4 w-4" />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t("Beds")}</span>
                        <span>
                          {variant.beds}{" "}
                          <Bed className="inline h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("Number of nights")}</span>
                  <span>{numberOfNights}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>{t("Total cost")}</span>
                  <span>${room ? room?.total_cost : null}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={confirmBooking}
                disabled={
                  !room ||
                  bookingConfirming
                }
              >
                {bookingConfirming ? <IonSpinner /> : null}
                {bookingConfirming ? t("Booking..") : t("Confirm Booking")}
              </Button>
            </motion.div>
          </SheetContent>
        </Sheet>
      </IonContent>
    </Page>
  );
}
