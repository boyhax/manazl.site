
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Home, Bed, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { create_booking } from '@/lib/db/bookings'
import { addDays, differenceInDays, format } from 'date-fns'

import { useTranslate } from '@tolgee/react'
import { useToast } from '@/hooks/use-toast'
import { DatePickerWithRange } from '@/components/ui/dateRangePicker'
import { useCurrency } from '@/hooks/useCurrency'
import useSearchfilter from '@/hooks/useSearchFilter'
import LoadingSpinnerComponent from 'react-spinners-components'
import { useQuery } from '@tanstack/react-query'
import { ToastAction } from '@/components/ui/toast'
import Page, { Header, HeaderBackButton, HeaderTitle } from '@/components/Page'
import supabase from 'src/lib/supabase'
import { useNavigate, useParams } from 'react-router'
import { IonContent } from '@ionic/react'
import { Label } from 'src/components/ui/label'
import { DateRangePickerwithouttrigger } from 'src/components/ui/dateRangePickerwithouttrigger'

type Room = {
    id: number | string;
    created_at: string;
    listing_id: number;
    thumbnail: string;
    title: string;
    active: boolean;
    short_id: string;
    beds: number;
    guests: number;
    rooms: number;
    description: string;
    type: string;
    aval: {
        id: number;
        cost: number;
        date: string;
        room_id: number;
        created_at: string;
        is_available: boolean;
    }[];
    listings: {
        short_id: string;
    };
};


export default function BookingSheet() {
    const { id } = useParams()
    const navigate = useNavigate();
    const { t } = useTranslate();
    const { toast } = useToast();
    const [bookingConfirming, setBookingConfirming] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room>();
    const { filter } = useSearchfilter<any>();
    const checkin = filter.checkin ? new Date(filter.checkin) : new Date();
    const checkout = filter.checkout ? new Date(filter.checkout) : addDays(checkin ? checkin : new Date(), 1);
    const days_count = differenceInDays(checkout, checkin);
    const [dateRange, setDateRange] = useState({ from: checkin, to: checkout });
    const { converted, currency } = useCurrency();
    const getrooms = async () => {
        function get_date(date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        }

        const { data, error } = await supabase
            .from("variants")
            .select('*,aval:room_availability!inner(*),listings!inner(short_id)')
            .eq("listings.short_id", id)
            .gte("aval.date", get_date(dateRange.from))
            .lt("aval.date", get_date(dateRange.to))

        if (error) throw Error(error.message)
        return data as Room[]
    }
    useEffect(() => {
        setSelectedRoom(undefined)
    }, [dateRange]);



    const { data: rooms, isLoading: isLoadingRooms } = useQuery({
        queryKey: ['rooms', id, dateRange],
        queryFn: getrooms
    })
    const get_cost = (room: Room) => room.aval.reduce((previousValue, currentValue, currentIndex, array) => { return previousValue + currentValue.cost }, 0)
    const isRoomAval = (room: Room) => room.aval.length == days_count
    const aval = [];
    rooms?.forEach((room) => {
        aval[room.id] = { aval: room.aval.length == days_count, cost: get_cost(room) }
    })


    console.log(rooms)



    const confirmBooking = async () => {
        setBookingConfirming(true);
        if (!selectedRoom) {
            toast({ title: 'Select Room' })
            return
        }
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            toast({
                title: "please Sign in First",
                action: (<ToastAction
                    onClick={() => navigate('/login?next=' + window.location.href)}
                    altText="Goto Sign in ">Sign In</ToastAction>
                )
            })
            return
        }
        try {
            const { data, error } = await create_booking({

                variant_id: selectedRoom.id as string,
                start_date: dateRange.from,
                end_date: dateRange.to,

            });
            console.log('error :>> ', error);
            if (error) throw Error(error.message)
            navigate(`/account/reservations/${data.id}`);
        } catch (error) {
            toast({
                title: t("Booking failed. Please try again."),
                duration: 3000,
            });
            console.error("Booking error:", error);
        } finally {
            setBookingConfirming(false);
        }
    };

    const noRoomsAvailable = !rooms || !rooms.length;

    return (
        <Page>
            <Header>
                <HeaderBackButton />
                <HeaderTitle>
                    {t("Book Your Stay")}
                </HeaderTitle>
                <div className="flex flex-col ms-auto">
                    <DateRangePickerwithouttrigger date={dateRange} setDate={setDateRange}>
                        <Label className="flex flex-col ms-auto">
                            <p>{format(dateRange.from, 'MMM dd')}</p>
                            {!dateRange.to?null:<p>{format(dateRange.to, 'MMM dd')}</p>}
                        </Label>
                    </DateRangePickerwithouttrigger>
                </div>


            </Header>
            <IonContent className="max-w-4xl mx-auto mt-0 flex flex-col ion-padding">
                
                <ScrollArea className="flex-grow overflow-y-auto justify-center items-center ">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4   "
                    >
                        {isLoadingRooms ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-muted-foreground">
                                        {t("Loading Rooms. Please Wait.")}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : null}
                        {noRoomsAvailable ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-muted-foreground">
                                        {t("No rooms available for the selected dates. Please choose different dates.")}
                                    </p>
                                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />

                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex flex-col gap-4 ">
                                {rooms.map((room, index) => (
                                    <Card
                                        key={index}
                                        className={`cursor-pointer transition-all w-full ${room?.id === selectedRoom?.id ? 'border-2 border-primary' : 'hover:shadow-md'}`}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span>{room.title}</span>
                                                {selectedRoom?.id === room.id && (
                                                    <Check className="text-primary" />
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="font-semibold mb-2">{room.type}</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span>{t("Guests")}</span>
                                                    <span>
                                                        {/* {variant?.guests}{" "} */}
                                                        <Users className="inline h-4 w-4" />
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>{t("Rooms")}</span>
                                                    <span>
                                                        {/* {variant?.rooms}{" "} */}
                                                        <Home className="inline h-4 w-4" />
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>{t("Beds")}</span>
                                                    <span>
                                                        {/* {variant?.beds}{" "} */}
                                                        <Bed className="inline h-4 w-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            {isRoomAval(room) ? <p className="text-right w-full font-bold">
                                                {currency}{converted(get_cost(room), '$')}
                                            </p> : <p>{t("Not Available")}</p>}
                                        </CardFooter>
                                    </Card>
                                ))}
                                    
                                    
                            </div>
                        )}


                    </motion.div>
                </ScrollArea>
                <div className="flex-shrink-0 p-4 bg-background pb-16">
                    <Button
                        className="w-full"
                        onClick={confirmBooking}
                        disabled={!selectedRoom || bookingConfirming || noRoomsAvailable}
                    >
                        {bookingConfirming ? <LoadingSpinnerComponent /> : null}
                        {bookingConfirming ? t("Booking..") : t("Confirm Booking")}
                    </Button>
                </div>
            </IonContent>
        </Page>
    )
}

