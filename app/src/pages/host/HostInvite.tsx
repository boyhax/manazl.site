import { IonButton, IonContent } from "@ionic/react";
import { FunctionComponent, useState } from "react";
import { CiMoneyCheck1, CiPaperplane, CiStar } from "react-icons/ci";
import Page from "src/components/Page";
import NewListingPage from "./listings/newHost";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router";

export function HostInvite() {
  const [start, setstart] = useState(false);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const newlistingpage = <NewListingPage key={"newhostpage"} />;

  return (

      <IonContent className={'ion-padding'}>
        <h2>
          {t("Create Your Host")}
        </h2>
        <p>
          {t("Are you thinking of making income from renting a property")}
        </p>
        <div
          className={
            " mt-3 rounded-xl  flex flex-col items-start space-x-2 px-5 border-b"
          }
        >
          <CiStar className={""} size={"3rem"} />

          <h2 className={"text-xl"}>{t("Increase the Number of guests")} </h2>
        </div>
        <div
          className={
            " mt-3 rounded-xl  flex flex-col items-start space-x-2 px-5 border-b"
          }
        >
          <CiPaperplane className={""} size={"3rem"} />
          <h2 className={"text-xl"}>
            {t("Reach and contact Your Guests easly")}{" "}
          </h2>
        </div>
        <div
          className={
            " mt-3 rounded-xl  flex flex-col items-start space-x-2 px-5 "
          }
        >
          <CiMoneyCheck1 className={""} size={"3rem"} />
          <h2 className={"text-xl"}>{t("Manage Bookings Fast & easy")} </h2>
        </div>

        <IonButton
          onClick={() => navigate("/account/create")}
          shape={"round"}
          className={"  mt-4"}
        >
          {t("Get started")}
        </IonButton>
      </IonContent>
 
  );
}
