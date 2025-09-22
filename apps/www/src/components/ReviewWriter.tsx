import { useToast } from "@/hooks/use-toast";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { submitReview } from "src/lib/db/reviews";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

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
  const { toast } = useToast();

  async function hindlesubmit() {
    data.rating = Math.round(100 * (data.rating / 5))
    console.log('data.rating :>> ', data.rating);
    const { error } = await submitReview(data);
    toast({
      title: error ? t("Some proble happened! Sorry") : t("Review Send .Thank You"),
      duration: 1500
    });
    onSubmit ? onSubmit() : null;
  }
  return (
    <div className={" p-2 flex-col flex gap-2"}>
      <Label>
        <strong>{t("Thank you for choosing manazl")}</strong>
        <p>{t("We hope you enjoyed")}</p>
      </Label>
      <Textarea
        value={data.text}
        onChange={(e) => setdata({ ...data, text: e.currentTarget.value })}
        placeholder={t("how was your stay?")}
      ></Textarea>
      <ReactStars
        count={5}
        onChange={(rate: number) => setdata({ ...data, rating: rate })}
        size={25}
        value={data.rating}
      />
      <Button onClick={hindlesubmit}>{t("send review")}</Button>
    </div>
  );
}
