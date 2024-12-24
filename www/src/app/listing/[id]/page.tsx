'use client'
import { useState, useRef, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { addDays } from "date-fns";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon, Map } from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Share, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Page, { HeaderBackButton } from "@/components/Page";
import ImageCarousel from "@/components/imageCorousol";
import ReviewsSection from "@/components/ReviewsSection";
import CommentsSection from "@/components/CommentsSection";
import supabase from "@/lib/supabase";
import { notFound, useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinnerComponent from "react-spinners-components";
import mapicon from 'src/assets/icons/mapicon.png';
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useRooms from "@/hooks/useRooms";
import { useCurrency } from "@/hooks/useCurrency";
import useSearchfilter from "@/hooks/useSearchFilter";
import BookingSheet from "./bookingSheet";
import { share } from "@/components/shareButton";
import { createClient } from "@/app/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/providers/userProvider";

const MapSetup = () => {
    const map = useMapEvents({});

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 500);
    }, []);

    return <></>;
};

const getlisting = (id) => async () => {
    const { data, error } = await supabase
        .from("listings")
        .select(
            "id,user_id,title,description,lat,lng,address,images,type,id,amenities,variants(*),user:listings_user_id_fkey!inner(avatar_url,full_name),likes(id)"
        )
        .or(`short_id.eq.${id}${Number.isInteger(id) ? `,id.eq.${id}` : ''}`)
        .single()

    if (error) notFound()
    return data
}
function get_cost(data: { listing_id: string, rooms: { total_cost: number }[] }[]) {
    let cost: number | null = null;
    data.forEach((value, index, array) => {
        value.rooms.forEach((room, index, array) => {

            if (!cost || room.total_cost < cost) {
                cost = room.total_cost
            }
        })
    })
    return cost

}
export default function ListingPage() {
    const { id } = useParams();
    const [view, setview] = useState('overview');
    const { t } = useTranslate();
    const { filter } = useSearchfilter<any>();
    const checkin = filter.checkin ? new Date(filter.checkin) : new Date();
    const checkout = filter.checkout ? new Date(filter.checkout) : addDays(new Date(), 1);
    const [dateRange, setDateRange] = useState({ from: checkin, to: checkout });
    const { converted, currency } = useCurrency();
    const mapRef = useRef<Map>(null);
    const { toast } = useToast();
    const { user } = useUserContext()
    const queryclient = useQueryClient()
    const { data: listingData, isLoading, error, isError } = useQuery({
        queryKey: ['listing', id],
        queryFn: getlisting(id)
    })


    if (isError) throw Error(error ? error.message : 'Host_Not_found')

    const { data: roomsData, isLoading: isLoadingRooms } = useRooms({
        id: listingData ? listingData.id : "",
        checkin: dateRange?.from ?? undefined,
        checkout: dateRange?.to ?? undefined
    })


    if (isLoading || !listingData) return <LoadingSpinnerComponent type="Infinity" />;
    let cost = roomsData ? get_cost(roomsData) : null;
    const like = listingData.likes && listingData.likes.length ? listingData.likes[0] : null;
    function hundleshare() {
        share({
            text: 'Hello From Manazl ,Find Travel Distinations in Oman Faster With us.',
            url: (window.location.href)
        })

    }
    async function handlelike() {
        let client = createClient()

        if (!user) {
            toast({
                title: 'Sign in Please'
            })
            return
        }
        if (like) {
            const { data, error } = await client.from('likes').delete().eq('id', like.id)
            console.log('like deleted :>> ', like.id);
            !error && setlike(null)

        } else {
            if (!listingData) return
            const { data, error } = await client.from('likes').insert({
                listing_id: listingData.id, user_id: user.id
            }).select('id').single()
            console.log('like made data,error:>> ', data, error);
            data && setlike(data)

        }
    }
    function setlike(d: any) {
        queryclient.setQueryData(['listing', id], (data: any) => {
            data.likes = d ? [d] : []
            return data
        })
    }
    return (
        <Page className="container mx-auto px-4 pb-8 max-w-3xl mb-16">
            <head>
                <title>{listingData.title}</title>
                <meta name='description' content={listingData.description}></meta>
                <meta name='og:image' content={listingData.images[0]}></meta>
                <meta name='og:title' content={listingData.title}></meta>
                <meta name='og:description' content={listingData.description}></meta>
            </head>

            <div className="flex p-2 h-fit top-0 sticky  bg-white w-full ">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center mb-2 bg-background "
                >
                    <HeaderBackButton />
                    {/* <Button onClick={hundleshare} variant={'ghost'} className="hover:text-blue-600 flex space-x-2">
                        <Share />
                    </Button> */}
                    <Button
                        onClick={handlelike}
                        variant="ghost"
                        size="icon"
                        className="   hover:text-blue-600"
                    >
                        {like ? <Heart fill={"red"} className="h-6 w-6" />
                            : <Heart className="h-6 w-6" />}
                    </Button>
                </motion.div>
            </div>
            <ScrollArea>
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
                            <BookingSheet id={listingData.id}>
                                <Button>
                                    {t("Select Room")}
                                </Button>
                            </BookingSheet>
                            <Link href={`/account/chat/redirect/${listingData?.id}`}>
                                <Button variant="outline">{t("Contact Host")}</Button>
                            </Link>

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
                                                <Badge variant="outline">
                                                    {currency}{cost ? converted(cost, '$') : null}/ {t("night")}
                                                </Badge>
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
                                                        {((listingData.user as any).full_name || 'name')
                                                            .split(" ")
                                                            .map((n: any) => n[0])
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
                                                    {listingData.amenities.map((amenity: string, index: number) => (
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
                                                    <Link target="_blank" href={`http://maps.google.com/maps?z=12&t=m&q=loc:${listingData.lat}+${listingData.lng}`}>

                                                        <MapContainer
                                                            ref={mapRef}
                                                            center={{ lat: listingData.lat, lng: listingData.lng }}
                                                            zoom={13}
                                                            scrollWheelZoom={false}
                                                            style={{ height: "100%", width: "100%" }}
                                                        >
                                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                            <Marker
                                                                position={{
                                                                    lat: listingData.lat,
                                                                    lng: listingData.lng
                                                                }}
                                                                icon={new Icon({
                                                                    iconSize: [25, 25], iconUrl: mapicon.src
                                                                })}
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


            </ScrollArea>
        </Page>
    );
}
