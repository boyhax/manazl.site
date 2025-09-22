import {
  IonContent, IonImg,
  IonProgressBar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonChip
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { differenceInDays, format } from "date-fns";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import Page, { Header, HeaderBackButton } from "src/components/Page";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { Booking } from "src/lib/db/bookings";
import supabase from "src/lib/supabase";

enum ReservationState {
  PENDING = "pending",
  CANCELED = "cancelled",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
}

export default function () {
  const params = useParams();
  const id = params?.id;
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { data, isLoading: loading, isError: error } = useQuery({
    queryKey: ['reservations', id],
    queryFn: getdata
  })
  async function getdata() {
    const { data, error } = await supabase
      .from("reservations")
      .select(
        "*,variants(listing_id,listings(thumbnail,title)),cancel_request:reservation_cancel_request(*)"
      )
      .eq("id", id)
      .single()
    if (error) throw Error(error.message)
    return data
  }

  if (loading) {
    return <IonProgressBar type="indeterminate" />;
  }
  if (error || !data) {
    console.log("error data booking page :>> ", error, data);
    throw Error("bad fetch");
  }
  console.log("data :>> ", data);
  const {
    created_at,
    end_date,
    start_date,
    state,
    total_pay,
    variants,
    cancel_reason,
    cancel_request,
  } = data as Booking & {
    cancel_request: any[];
    variants: { listings: { thumbnail; title } };
  };

  const nights = differenceInDays(new Date(end_date!), new Date(start_date!));
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
      <Header>
        <HeaderBackButton />
      </Header>
      <IonContent className={"ion-padding"}>
        <IonCard>
          <IonCardHeader>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{t("Booking")}</h1>
              <IonChip color={statesColor}>{statesName}</IonChip>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <div className="flex items-center mb-4">
              <div className="w-24 h-24 mr-4">
                <IonImg
                  src={variants.listings.thumbnail}
                  alt="thumbnail"
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div className={"ps-2"}>
                <h2 className="text-xl font-semibold">{variants.listings.title}</h2>
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
                value={format(new Date(end_date), "MMM d, yyyy")}
              />
              <BookingDetail
                label={t("Total")}
                value={`${total_pay} ${t("OMR")}`}
                highlight
              />
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
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


