import { IonButton, IonLabel, IonTextarea, useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { submitReview } from "src/lib/db/reviews";

export default function ReviewWriter({
  listing_id,
  onSubmit,
  onFail,
}: {
  listing_id: string;
  onSubmit?: () => void;
  onFail?: () => void;
}) {
  const { t } = useTranslate();
  const [data, setdata] = useState({ rating: 2.5, text: "", listing_id });
  const [toast] = useIonToast();
  console.log('data :>> ', data);
  async function hindlesubmit() {
    data.rating = Math.round(100*(data.rating/5))
    console.log('data.rating :>> ', data.rating);
    const { error } = await submitReview(data);
    toast(
      error ? t("Some proble happened! Sorry") : t("Review Send .Thank You"),
      1500
    );
    console.log("review send :>> ", error);
    onSubmit ? onSubmit() : null;
  }
  return (
    <div className={" p-2 flex-col flex gap-2"}>
      <IonLabel>
        <h1>{t("Thank you for choosing manazl")}</h1>
        <p>{t("We hope you enjoyed")}</p>
      </IonLabel>
      <IonTextarea
        fill={"outline"}
        
        value={data.text}
        onIonChange={(e) => setdata({ ...data, text: e.detail.value })}
        placeholder={t("how was your stay?")}
      ></IonTextarea>
      <ReactStars
        count={5}
        onChange={(rate) => setdata({ ...data, rating: rate })}
        size={25}
        value={data.rating}
      />
      <IonButton onClick={hindlesubmit}>{t("send review")}</IonButton>
    </div>
  );
}
