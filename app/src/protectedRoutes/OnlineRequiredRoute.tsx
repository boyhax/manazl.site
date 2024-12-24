import { IonContent, IonIcon, IonText } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { cloudOfflineOutline } from "ionicons/icons";
import { Outlet } from "react-router-dom";
import Page from "src/components/Page";
import ProtectedRoute from "src/components/protectedRoute";
import { useNetworkStore } from "src/state/Online";

export default function OnlineRequiredRoute(): JSX.Element {
  const connected = useNetworkStore((s: any) => s.connected);
  console.log("internet connection => ",connected);
  
  return (
    <ProtectedRoute check={connected} fallback={<NoNet />}>
      <Outlet />
    </ProtectedRoute>
  );
}

const NoNet = () => {
  const { t } = useTranslate();

  return (
    <Page>
      <IonContent>
        <div
          className={
            "flex flex-col justify-center items-center mt-24 h-[70%] shad "
          }
        >
          <IonText className={"text-slate-700 text-2xl font-serif select-none"}>
            {t("Internet Connection Lost")}
          </IonText>
          <IonIcon icon={cloudOfflineOutline} className={"  my-5 text-4xl"} />
          {/* <IonIcon className={'w-[100px] h-[100px] max-h-md max-w-md'} icon={logoStencil}/> */}
        </div>
      </IonContent>
    </Page>
  );
};
