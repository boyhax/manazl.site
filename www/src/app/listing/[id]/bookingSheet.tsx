'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Home, Bed, Check } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { createClient } from '@/app/lib/supabase/client'
import { create_booking } from '@/lib/db/bookings'
import { addDays, differenceInDays } from 'date-fns'
import useRooms from '@/hooks/useRooms'
import { useRouter } from 'next/navigation'
import { useTranslate } from '@tolgee/react'
import { useToast } from '@/hooks/use-toast'
import { DatePickerWithRange } from '@/components/ui/dateRangePicker'
import { useCurrency } from '@/hooks/useCurrency'
import useSearchfilter from '@/hooks/useSearchFilter'
import LoadingSpinnerComponent from 'react-spinners-components'
import { useQuery } from '@tanstack/react-query'
import { ToastAction } from '@/components/ui/toast'

const getdata = (id) => async () => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("variants")
        .select(
            "beds,rooms,guests"
        )
        .eq("id", id)
        .single()

    if (error) throw Error(error.message)
    return data
}

export default function BookingSheet({
    children, id
}) {
    const navigate = useRouter();
    const { t } = useTranslate();
    const { toast } = useToast();
    const router = useRouter()
    const [bookingConfirming, setBookingConfirming] = useState(false);
    const [room, setRoom] = useState<{ room_id, room_type, total_cost, }>();
    const { filter } = useSearchfilter<any>();
    const checkin = filter.checkin ? new Date(filter.checkin) : new Date();
    const checkout = filter.checkout ? new Date(filter.checkout) : addDays(new Date(), 1);
    const [dateRange, setDateRange] = useState({ from: checkin, to: checkout });
    const { converted, currency } = useCurrency();
    useEffect(() => {
        setRoom(undefined)
    }, [dateRange]);

    const { data: roomsData, isLoading: isLoadingRooms } = useRooms({
        id,
        checkin: dateRange?.from ?? undefined,
        checkout: dateRange?.to ?? undefined
    })

    const { data: variant } = useQuery({
        queryKey: ['variant', room],
        queryFn: getdata(id)
    })
    const numberOfNights =
        dateRange?.from && dateRange?.to
            ? differenceInDays(dateRange.to, dateRange.from)
            : 0;

    const confirmBooking = async () => {
        setBookingConfirming(true);
        if (!room) {
            toast({ title: 'Select Room' })
            return
        }
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            toast({
                title: "please Sign in First",
                action: (<ToastAction
                    onClick={() => router.push('/login?next=' + window.location.href)}
                    altText="Goto Sign in ">Sign In</ToastAction>
                )
            })
            return
        }
        try {
            const { data, error } = await create_booking({
                title: ``,
                variant_id: room.room_id,
                start_date: dateRange.from,
                end_date: dateRange.to,
                total_pay: room.total_cost,
            });
            console.log('error :>> ', error);
            if (error) throw Error(error.message)
            navigate.push(`/account/reservations/${data.id}`);
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

    const noRoomsAvailable = !roomsData || !roomsData.length || roomsData[0]?.rooms.length === 0;

    return (
        <Sheet>
            <SheetTrigger>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="max-w-4xl mx-auto h-[80vh] flex flex-col">
                <SheetHeader className="flex-shrink-0">
                    <SheetTitle>{t("Book Your Stay")}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-grow overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 p-4"
                    >
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
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
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roomsData && roomsData[0]?.rooms.map((roomOption, index) => (
                                    <Card
                                        key={index}
                                        className={`cursor-pointer transition-all ${room?.room_id === roomOption.room_id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                                        onClick={() => setRoom(roomOption)}
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                <span>{roomOption.title}</span>
                                                {room?.room_id === roomOption.room_id && (
                                                    <Check className="text-primary" />
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="font-semibold mb-2">{roomOption.room_type}</p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span>{t("Guests")}</span>
                                                    <span>
                                                        {variant?.guests}{" "}
                                                        <Users className="inline h-4 w-4" />
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>{t("Rooms")}</span>
                                                    <span>
                                                        {variant?.rooms}{" "}
                                                        <Home className="inline h-4 w-4" />
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>{t("Beds")}</span>
                                                    <span>
                                                        {variant?.beds}{" "}
                                                        <Bed className="inline h-4 w-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <p className="text-right w-full font-bold">
                                                {currency}{converted(roomOption.total_cost, '$')}/{t("nights") + " " + numberOfNights}
                                            </p>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {room && (
                            <div className="space-y-2 p-4 bg-muted rounded-lg">
                                <div className="flex justify-between">
                                    <span>{t("Number of nights")}</span>
                                    <span>{numberOfNights}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>{t("Total cost")}</span>
                                    <span>{currency}{converted(room.total_cost, '$')}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </ScrollArea>
                <div className="flex-shrink-0 p-4 bg-background">
                    <Button
                        className="w-full"
                        onClick={confirmBooking}
                        disabled={!room || bookingConfirming || noRoomsAvailable}
                    >
                        {bookingConfirming ? <LoadingSpinnerComponent /> : null}
                        {bookingConfirming ? t("Booking..") : t("Confirm Booking")}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

