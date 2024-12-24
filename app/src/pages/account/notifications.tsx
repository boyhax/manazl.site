import {
  IonProgressBar,
  useIonAlert,
  useIonToast
} from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { formatDistance } from "date-fns";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router";
import BackButton from "src/components/BackButton";
import { EmptyMessage } from "src/components/errorMessage";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";

interface MyListingsProps {}

const NotificationsView: FunctionComponent<MyListingsProps> = () => {
  const { session } = auth();
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const { t } = useTranslate();

  const { data, error, loading, setdata, fetch } = useSupabaseQuery(
    supabase
      .from("notifications")
      .select("*")
      .limit(15)
      .order("created_at", { ascending: false })
      .eq("user_id", session?.user?.id)
  );
  console.log("notification data :>> ", data);
  const [alert] = useIonAlert();

  console.log("Notifications :>> ", data);
  return (
    <div className="container mx-auto px-4 py-8 overflow-y-auto pb-16 scroll-smooth">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <BackButton />
      </div>
      <div className={"flex flex-col   gap-1 w-full lg:p-5 md:p-3"}>
        {loading && <IonProgressBar type={"indeterminate"} />}
        {!data ||
          (data.length <= 0 && (
            <div
              className={
                "flex flex-col items-center justify-center w-full mt-12"
              }
            >
              <EmptyMessage message={t("No notifications Found")} />
            </div>
          ))}
        <div className="grid gap-4 p-10">
          {data &&
            data.map!(
              (
                notification: {
                  id: string;
                  title: string;
                  body: string;
                  url: string;
                  received: boolean;
                  created_at: string;
                },
                index
              ) => {
                return (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.body}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistance(
                          new Date(notification.created_at),
                          new Date(),

                          {
                            addSuffix: true,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
