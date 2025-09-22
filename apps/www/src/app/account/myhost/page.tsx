

import { createClient } from "@/app/lib/supabase/server"
import BecomeHostCard from "./components/BecomeHostCard"
import HostSammaryCard from "./components/HostSammaryCard"


async function accountSummaryFetch() {
    const reservationSelect = "created_at,id,user_id,state,start_date,end_date,total_pay,listing:listings!inner(title,host:user_id), user:profiles!inner(full_name,avatar_url)"

    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) throw Error('user not found')

    const { data, error } = await client
        .from("listings")
        .select(
            `id,title,created_at,images,rating,variants(title,type,id,active),reservations(${reservationSelect})`
        )
        .eq("user_id", user.id)
        .limit(5, { referencedTable: "reservations" })
        .gte('reservations.start_date', new Date().toDateString())
        .order("created_at", {
            ascending: false,
            referencedTable: "reservations",
        })
        .single()
    if (error) throw Error(error.message)
    return data
}

export default async function AccountPage() {
    const listing = await accountSummaryFetch()
    return (
        <main className="flex-1 space-y-6">
            {listing ? (
                <HostSammaryCard key={listing.id} listing={listing} />
            ) : (
                <BecomeHostCard />
            )}

        </main>


    )
}