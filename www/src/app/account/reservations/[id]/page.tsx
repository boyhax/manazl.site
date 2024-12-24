
import { createClient } from "@/app/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDays, differenceInDays, format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import Page from "src/components/Page";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { Booking } from "src/lib/db/bookings.types";

enum ReservationState {
    PENDING = "pending",
    CANCELED = "cancelled",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
}

export default async function ReservationPage({ params }) {
    const { id } = params;
    const { t } = {
        t: (te: string) => te
    };
    const supabase = createClient();
    const { data, error } = await
        supabase
            .from("reservations")
            .select(
                "*,variants(listing:listings!inner(images,title)),cancel_request:reservation_cancel_request(*)"
            )
            .eq("id", id)
            .single()


    if (error || !data) {
        throw Error(error?.message || "bad fetch");
    }

    const {
        created_at,
        end_date,
        start_date,
        state,
        total_pay,
        listing,
        cancel_reason,
        cancel_request,
    } = data as Booking & {
        cancel_request: any[];
        listing: { images; title };
    };

    const nights = differenceInDays(addDays(new Date(end_date!), 1), new Date(start_date!));
    var statesName;
    var statesColor = "primary";
    switch (data.state) {
        case ReservationState.PENDING:
            statesName = t("Booking Sent and Waiting Approval");
            statesColor = 'medium'
            break;
        case ReservationState.CANCELED:
            statesName = t("Booking Canceled !");
            statesColor = "danger";
            break;
        case ReservationState.CONFIRMED:
            statesName = t("Waiting Your Arrival");
            statesColor = "wanring";
            break;
        case ReservationState.COMPLETED:
            statesName = t("Your Stay Ended. Hope You Enjoyed");
            statesColor = "success";
            break;
        default:
            break;
    }
    if (cancel_request && cancel_request.length > 0) {
        statesName = t("Cancelation Request Send but not Accepted yet");
        statesColor = "danger";
    }
    return (
        <Page>
            <ScrollArea >
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">{t("Booking")}</h1>
                            <Badge color={statesColor}>{statesName}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center mb-4">
                            <div className="w-24 h-24 mr-4">
                                <Image
                                    height={200} width={300}
                                    src={listing?.images ? listing.images : ''}
                                    alt="host photo"
                                    className="rounded-lg object-cover w-full h-full"
                                />
                            </div>
                            <div className={"ps-2"}>
                                <h2 className="text-xl font-semibold">{listing?.title}</h2>
                                <p className="text-sm text-gray-500">
                                    {format(new Date(created_at), "MMMM d, yyyy")}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {t("refrence number ")}
                                    {id}
                                </p>
                            </div>
                        </div>

                        {cancel_request && cancel_request.length > 0 ? (
                            <Alert variant={"destructive"} className={"bg-blend-overlay"}>
                                <AlertCircleIcon />

                                <AlertTitle>
                                    {t(
                                        state === ReservationState.CANCELED
                                            ? "Cancelation Request"
                                            : "Cancelation Request Send but not Accepted yet"
                                    )}
                                </AlertTitle>
                                <AlertDescription>
                                    {cancel_request[0].cancel_reason}
                                </AlertDescription>
                            </Alert>
                        ) : null}

                        <div className="grid grid-cols-2 gap-4">
                            <BookingDetail label={t("Nights")} value={nights} />
                            <BookingDetail
                                label={t("CheckIn")}
                                value={format(new Date(start_date), "MMM d, yyyy")}
                            />
                            <BookingDetail
                                label={t("CheckOut")}
                                value={format(addDays(new Date(end_date), 1), "MMM d, yyyy")}
                            />
                            <BookingDetail
                                label={t("Total")}
                                value={`$${total_pay}`}
                                highlight
                            />
                        </div>
                    </CardContent>
                </Card>
            </ScrollArea>
        </Page>
    );
}

// Add these new components at the end of the file
function BookingDetail({ label, value, highlight = false }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm text-gray-500">{label}</span>
            <span
                className={`font-semibold ${highlight ? "text-lg text-primary" : ""}`}
            >
                {value}
            </span>
        </div>
    );
}


