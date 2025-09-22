'use client'

import { useTranslate } from "@tolgee/react"
import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinnerComponent from "react-spinners-components"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { getuserid } from "src/lib/db/auth"
import supabase from "src/lib/supabase"

import ReservationCard from "../components/ReservationCard"
import { useUserContext } from "@/providers/userProvider"

const reservationSelect = "created_at,id,user_id,state,start_date,end_date,total_pay,listing:listings!inner(title,host:user_id), user:profiles!inner(full_name,avatar_url)"

async function accountLoader() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw Error('user_not_found')
    const { data, error } = await supabase
        .from("profiles")
        .select(
            `listings(id,title,created_at,images,rating,variants(title,type,id,active),reservations(${reservationSelect})),reservations(${reservationSelect}),likes(count),notifications(count)`
        )
        .eq("id", user.id)
        .limit(5, { referencedTable: "listings.reservations" })
        .limit(5, { referencedTable: "reservations" })
        .gte('reservations.start_date', new Date().toDateString())
        .gte('listings.reservations.start_date', new Date().toDateString())
        .order("created_at", { ascending: false, referencedTable: "reservations" })
        .order("created_at", {
            ascending: false,
            referencedTable: "listings.reservations",
        })
        .single()
    console.log('data,error :>> ', data, error);
    if (error) throw Error(error.message)

    return data
}

export default function Resevations() {
    const { user } = useUserContext()

    const { data, isLoading, error } = useQuery({
        queryKey: ["account"],
        queryFn: accountLoader,
    })


    const [reservationsSection, setreservationsSection] = useState<
        "self" | "host" | "all"
    >("all")

    const { t } = useTranslate()

    const userReservations = data ? data?.reservations : []
    const listingReservations =
        data && data?.listings && data.listings.length > 0
            ? data.listings[0].reservations
            : []

    function filerreservation(reservation: any) {
        if (!user) return
        return reservationsSection == "host"
            ? reservation.user_id != user.id
            : reservationsSection == "self"
                ? reservation.user_id == user.id
                : true
    }
    var reservations = [
        ...(userReservations || []),
        ...(listingReservations || []),
    ].filter(filerreservation)



    if (isLoading) return <LoadingSpinnerComponent type="Ball" />



    return (
        <main className="flex-1 space-y-6">
            <div className="space-y-6">
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
                        <Link href={"/reservations"}>
                            <Button variant="ghost" size="sm">
                                {t("View all")}
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {!!reservations ? (
                            <ul className="space-y-3">
                                {reservations.map((reservation, i) => (
                                    <ReservationCard
                                        key={"reservationcard" + i}
                                        reservation={reservation as any}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400">
                                {t("No reservations found.")}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

        </main>

    )
}