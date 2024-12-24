import Page from "src/components/Page";

import { Share } from "@capacitor/share";
import {
  IonButtons, IonItem, IonList,
  IonListHeader,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle
} from "@ionic/react";
import { useTolgee, useTranslate } from "@tolgee/react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "src/components/BackButton";
import Header from "src/components/Header";
import Toolbar from "src/components/Toolbar";
import useDisclosore from "src/hooks/useDisclosore";
import { SignOut } from "src/lib/db/auth";
import { updateUser } from "src/lib/db/profile";
import getPathTo from "src/lib/utils/getPathTo";
import { subscribeToTopic, unSubscribeToTopic } from "src/state/Notifications";
import { auth } from "src/state/auth";
import FeedBackView from "src/views/feedbackView";
import { Label } from "src/components/ui/label";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Button } from "src/components/ui/button";
import { useCurrency } from "src/hooks/useCurrency";

const defaultNotifications = {
  messages: true,
  bookings: true,
  ads: true,
};
export default function Settings(props: any) {
  const session = auth((s) => s.session);
  const isHost = auth((s) => s.isHost);
  const notifications = session
    ? session.user.user_metadata?.notifications! || defaultNotifications
    : defaultNotifications;
  const user = session ? session.user : null;
  // const [editaccount, seteditaccount] = useState(false);
  const tolgee = useTolgee(["language"]);
  const navigate = useNavigate();
  const [feedbackopen, onfeedbackopen, onfeedbackclose] = useDisclosore();
  const lang = tolgee.getLanguage();
  const { t } = useTranslate();
  const { currency, setCurrency } = useCurrency()
  const onlanguageChange = () => {
    tolgee.changeLanguage(lang === "en" ? "ar" : "en");
  };

  function shareapp() {
    Share.share({
      text: "Visit Manazl App ",
      url: getPathTo(""),
      dialogTitle: "Manazl App",
    });
  }

  const update_notification = (
    update: Partial<typeof defaultNotifications>
  ) => {
    const newnot = { ...notifications, ...update };
    updateUser({ notifications: newnot });
  };
  return (
    <Page>
      <Header>
        <Toolbar>
          <IonButtons>
            <BackButton />
          </IonButtons>

          <IonTitle slot={"primary"}>{t("settings")}</IonTitle>
          {/* <IonButtons slot={"end"}>
            <ThemeToggle />
          </IonButtons> */}
        </Toolbar>
      </Header>
      <IonModal
        isOpen={feedbackopen}
        backdropDismiss
        onDidDismiss={onfeedbackclose}
        className={"dialog-modal "}
      >
        <div className={"wrapper"}>
          <FeedBackView onsend={onfeedbackclose} />
        </div>
      </IonModal>

      {/* <MainContent> */}
      <ScrollArea className={"w-full mx-auto max-w-md  px-4"}>
        <div className={"mt-2"} />
        <IonListHeader>{t("Account")}</IonListHeader>

        <IonList inset={true} mode={"ios"}>
          <IonItem
            className={"cursor-pointer"}
            disabled={!session}
            onClick={() => navigate("/changepassword")}
          >
            {t("Change Password")}
          </IonItem>
          <IonItem
            className={"cursor-pointer"}
            onClick={session ? SignOut : () => navigate("/login")}
          >
            {session ? t("LogOut") : t("LogIn")}
          </IonItem>
        </IonList>
        <IonListHeader>{t("General")}</IonListHeader>
        <IonList inset={true} mode={"ios"}>
          <IonItem style={{ direction: "ltr" }}>
            <IonSegment
              mode="ios"
              value={lang}
              onIonChange={onlanguageChange}
            >
              <IonSegmentButton value="ar" title="arabic">
                العربية
              </IonSegmentButton>
              <IonSegmentButton value="en" title="english">
                English
              </IonSegmentButton>
            </IonSegment>
          </IonItem>
          <IonItem>
            <IonSelect value={currency} onIonChange={e => setCurrency(e.detail.value)} label={t("currency")} placeholder="Currency">
              <IonSelectOption value="OMR">{t("Omani Rial")}</IonSelectOption>
              <IonSelectOption value="$">{t("US Dollar")}</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <Link to={"/policy"}>{t("Terms of Service")}</Link>
          </IonItem>
          <IonItem className={"cursor-pointer"} onClick={onfeedbackopen}>
            {t("Talk With Us")}
          </IonItem>
          <IonItem className={"cursor-pointer"} onClick={shareapp}>
            {t("Share The App")}
          </IonItem>
        </IonList>

        <IonListHeader>{t("Notifications")}</IonListHeader>
        <IonList inset={true} mode={"ios"}>
          <IonItem>
            <IonToggle
              checked={notifications?.ads!}
              onIonChange={(e) => {
                e.detail.checked
                  ? subscribeToTopic("ads,news")
                  : unSubscribeToTopic("ads,news");
                update_notification({ ads: !notifications.ads });
              }}
            >
              {t("Ads & News")}
            </IonToggle>
          </IonItem>
          {session?.user! && (
            <IonItem>
              <IonToggle
                checked={notifications?.messages!}
                onIonChange={(e) => {
                  if (user) {
                    update_notification({
                      messages: !notifications.messages,
                    });
                    e.detail.checked
                      ? subscribeToTopic("message:id." + user.id)
                      : unSubscribeToTopic("message:id." + user.id);
                  }
                }}
              >
                {t("Messages")}
              </IonToggle>
            </IonItem>
          )}
          {isHost && (
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
          )}
        </IonList>
        <div
          className={
            "w-full flex items-center justify-center flex-col text-center"
          }
        >
          <Label className={"p-2"}>
            <p>
              <Link to="https://manazl.site">
                <Button variant={"link"}>Manazl</Button>
              </Link>
              {" "}
              v1.0
            </p>
          </Label>
        </div>
        {/* <div className={"h-16"} /> */}
      </ScrollArea>
      {/* </MainContent> */}
    </Page>
  );
}
