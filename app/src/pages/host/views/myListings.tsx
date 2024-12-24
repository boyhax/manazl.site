import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonLabel,
  IonListHeader,
  IonPopover,
  IonThumbnail,
  IonToggle,
  useIonAlert,
  useIonToast
} from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { addOutline, informationCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Img from "src/components/Image";
import ImageSection from "src/components/imageSection";
import useMyListing from "src/hooks/useMyListing";
import supabase from "src/lib/supabase";

export const MyListingsView = () => {
  const navigate = useNavigate();
  const [toast] = useIonToast();

  const { variants, listing } = useMyListing();
  const { t } = useTranslate();
  return (
    <IonContent className={"ion-padding"}>
      {listing ? (
        <CurrentListingCard data={listing} />
      ) : (
        <h1>{t("Create Now")}</h1>
      )}
      <IonListHeader>
        {t("Variants")}{" "}
        <span>
          <IonButton
            onClick={() => navigate("newvariant")}
            fill={"outline"}
            className={"ms-3"}
            size={"small"}
            shape={"round"}
          >
            {t("add")}
            <IonIcon icon={addOutline} />
          </IonButton>
        </span>
      </IonListHeader>
      <>
        {variants?.map!((value) => {
          return <VariantPreview key={value.id} data={value} />;
        })}
      </>
    </IonContent>
  );
};

const CurrentListingCard = ({ data }) => {
  const navigate = useNavigate();
  const [listing, setlisting] = useState(data);
  const { t } = useTranslate();

  const hundleActive = async () => {
    let active = !listing.active;
    const { error,data } = await supabase
      .from("listings")
      .update({ active })
      .eq("id", listing.id).select()
      .single();
    !error && setlisting({...listing,...data});
  };
  if (!listing) return null;

  return (
    <div
      className={
        "card border border-gray-300 shadow-md  w-full max-w-sm flex  my-6 overflow-hidden"
      }
      key={"mylistingcard"}
    >
      <Link to={`editlisting/${listing.id}`}>
        <ImageSection images={listing.images} />
      </Link>

      <div className={" p-4 flex capitalize flex-col justify-between w-full"}>
        <IonLabel className={" text-lg text-pretty"}>
          {listing?.title!}
        </IonLabel>
        <div className={"flex flex-row items-center justify-between"}>
         
          
          <div className={"flex items-center gap-2"}>
            <IonToggle
              checked={listing?.active}
              onIonChange={hundleActive}
            ></IonToggle>
            {!listing.approved && (
              <p className={"shadow-sm rounded-full p-1 bg-secondary-default"}>
                {t("Approval Pending")}{" "}
                <span>
                  <IonIcon icon={informationCircleOutline} id="approvalmark" />{" "}
                  <IonPopover
                    trigger={"approvalmark"}
                    className={"p-2 rounded-full"}
                  >
                    <p>
                      {t(
                        "Your Place will not be visible until Approval from site Admins"
                      )}
                    </p>
                  </IonPopover>{" "}
                </span>{" "}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const VariantPreview = ({ data }) => {
  const [alert] = useIonAlert();
  const [toast] = useIonToast();
  const { t } = useTranslate();
  const [variant, setvariant] = useState(data);

  const hundleToggleActive = async () => {
    const { error } = await supabase
      .from("variants")
      .update({ active: !variant.active })
      .eq("id", variant.id);
    !error && setvariant({ ...variant, active: !variant.active });

    return { error, data: null };
  };
  const hundleDelete = async () => {
    if (!variant) throw Error("variant not found =>");
    const { error } = await supabase
      .from("variants")
      .delete()
      .eq("id", variant.id);
    !error && setvariant(null);

    if (error) {
      toast(t("problem!" + error.message), 1000);
    } else {
      toast(t("variant removed"), 1000);
    }

    return { error, data: null };
  };
  if (!variant) return null;

  const _onDelete = async () => {
    alert(t("Are you sure You Want To Delete"), [
      { text: t("Yes"), handler: hundleDelete },
      { text: t("cancel"), role: "cancel" },
    ]);
  };

  return (
    <div
      className={
        "rounded-lg  flex-row gap-2 items-center border border-gray-300 shadow-md px-4 py-2 w-full max-w-sm flex  mb-7 "
      }
    
    >
      <IonThumbnail slot={"start"}>
        <Link to={`editvariant/${variant.id}`}>
          <Img src={variant.thumbnail!} className={"object-cover "} />{" "}
        </Link>
      </IonThumbnail>

      <IonLabel className={"text-xl grow"}>
        <h3>{variant.title!}</h3>
        <p>
          {variant?.rate} {t("OMR")}
        </p>
      </IonLabel>

      <IonButtons>
        <IonButton color={"danger"} onClick={_onDelete}>
          <BiTrash />
        </IonButton>
      </IonButtons>
      <IonToggle
        slot={"end"}
        checked={variant.active}
        onIonChange={hundleToggleActive}
      ></IonToggle>
      {/* </div> */}
    </div>
  );
};
