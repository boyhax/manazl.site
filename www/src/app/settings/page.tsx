'use client'
import Page, { Header, HeaderBackButton, HeaderTitle } from "src/components/Page";
import { useTolgee, useTranslate } from "@tolgee/react";
import useDisclosore from "src/hooks/useDisclosore";
import { SignOut } from "src/lib/db/auth";
import { updateUser } from "src/lib/db/profile";
import { Label } from "src/components/ui/label";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Button } from "src/components/ui/button";
import { useCurrency } from "src/hooks/useCurrency";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import Link from "next/link";
import { Toggle } from "@/components/ui/toggle";
import { useUserContext } from "@/providers/userProvider";

const defaultNotifications = {
  messages: true,
  bookings: true,
  ads: true,
};
export default function Settings(props: any) {
  const { user } = useUserContext()
  const notifications = user
    ? user.user_metadata?.notifications! || defaultNotifications
    : defaultNotifications;

  const tolgee = useTolgee(["language"]);
  const navigate = useRouter();
  const [feedbackopen, onfeedbackopen, onfeedbackclose] = useDisclosore();
  const lang = tolgee.getLanguage();
  const { t } = useTranslate();
  const { currency, setCurrency } = useCurrency()
  const onlanguageChange = () => {
    tolgee.changeLanguage(lang === "en" ? "ar" : "en");
  };



  const update_notification = (
    update: Partial<typeof defaultNotifications>
  ) => {
    const newnot = { ...notifications, ...update };
    updateUser({ notifications: newnot });
  };
  return (
    <Page>
      <Header>
        <HeaderBackButton />

        <HeaderTitle >{t("settings")}</HeaderTitle>
        {/* <IonButtons slot={"end"}>
            <ThemeToggle />
          </IonButtons> */}
      </Header>
      <Dialog
        open={feedbackopen}
        onOpenChange={open => !open ? onfeedbackclose() : null}
      >
        <div className={"wrapper"}>
          {/* <FeedBackView onsend={onfeedbackclose} /> */}
        </div>
      </Dialog>

      <ScrollArea className={"w-full mx-auto max-w-md  px-4"}>
        <div className={"mt-2"} />
        <h2>{t("Account")}</h2>

        <div className="flex flex-col gap-2 shadow-sm border border-border rounded-md p-2 m-4" >
          <div
            className={"cursor-pointer flex flex-row p-2 w-full"}
            onClick={() => navigate.push("/changepassword")}
          >
            {t("Change Password")}
          </div>
          <div
            className={"cursor-pointer flex flex-row "}
            onClick={user ? SignOut : () => navigate.push("/login")}
          >
            {user ? t("LogOut") : t("LogIn")}
          </div>
        </div>
        <h2>{t("General")}</h2>
        <div className="flex flex-col gap-2 shadow-sm border border-border rounded-md p-2 m-4" >
          <div dir="ltr" >
            <Select
              value={lang}
              onValueChange={onlanguageChange}
            >
              <SelectTrigger>
                {lang}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar" title="arabic">
                  العربية
                </SelectItem>
                <SelectItem value="en" title="english">
                  English
                </SelectItem>
              </SelectContent>

            </Select>
          </div>
          <div
            className={"cursor-pointer flex flex-row p-2 w-full"}>
            <Select value={currency} onValueChange={setCurrency} >
              <SelectTrigger>
                {currency}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OMR">{t("Omani Rial")}</SelectItem>
                <SelectItem value="$">{t("US Dollar")}</SelectItem>
              </SelectContent>

            </Select>
          </div>
          <div>
            <Link href={"/policy"}>{t("Terms of Service")}</Link>
          </div>
          <div className={"cursor-pointer"} onClick={onfeedbackopen}>
            {t("Talk With Us")}
          </div>
          <div className={"cursor-pointer"} >
            {t("Share The App")}
          </div>
        </div>

        <h2>{t("Notifications")}</h2>
        <div className="flex flex-col gap-2 shadow-sm border border-border rounded-md p-2 m-4" >
          <div>
            <Toggle
              value={notifications?.ads!}
            // onChange={(e) => {
            //   e.currentTarget.value
            //     ? subscribeToTopic("ads,news")
            //     : unSubscribeToTopic("ads,news");
            //   update_notification({ ads: !notifications.ads });
            // }}
            >
              {t("Ads & News")}
            </Toggle>
          </div>
          {user! && (
            <div>
              <Toggle
                value={notifications?.messages!}
              // onChange={(e) => {
              //   if (user) {
              //     update_notification({
              //       messages: !notifications.messages,
              //     });
              //     e.currentTarget.value
              //       ? subscribeToTopic("message:id." + user.id)
              //       : unSubscribeToTopic("message:id." + user.id);
              //   }
              // }}
              >
                {t("Messages")}
              </Toggle>
            </div>
          )}
          {/* {isHost && (
            <IonItem>
              <IonToggle
                checked={notifications?.bookings!}
                onIonChange={(e) => {
                  if (user) {
                    update_notification({
                      bookings: !notifications.bookings,
                    });
                    subscribeToTopic("bookings:id." + user.id);
                  }
                }}
              >
                {t("bookings")}
              </IonToggle>
            </IonItem>
          )} */}
        </div>
        <div
          className={
            "w-full flex items-center justify-center flex-col text-center"
          }
        >
          <Label className={"p-2"}>
            <p>
              <Link href="https://manazl-web.vercel.app">
                <Button variant={"link"}>Manazl</Button>
              </Link>
              {" "}
              v1.0
            </p>
          </Label>
        </div>
      </ScrollArea>
    </Page>
  );
}
