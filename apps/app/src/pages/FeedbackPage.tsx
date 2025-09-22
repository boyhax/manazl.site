import {
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonModal,
  IonSpinner,
  useIonAlert,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import Page from "../components/Page";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router";
import supabase from "src/lib/supabase";
import { getuserid } from "src/lib/db/auth";
import Input from "src/components/Input";

export default function ContactUsPage() {
  const [pending, setpending] = useState(false);
  const navigate = useNavigate();
  const [contact, setcontact] = useState("");
  const [toast] = useIonToast();
  const textInput: any = useRef<HTMLTextAreaElement>();
  const history = useIonRouter();
  const { t } = useTranslate();
  function onDissmiss() {
    navigate(-1);
  }

  return (
    <IonModal className={"dialog-modal"} isOpen onDidDismiss={onDissmiss}>
      <div className={"dialog-wrapper p-4"}>
        <h1>{t("feedback")}</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setpending(true);
            sendContactUs({
              message: textInput.current.value,
              contact,
            }).finally(() => {
              toast({
                message: t("Your message has been sent"),
                duration: 1000,
              });
              setpending(false);
              navigate(-1);
            });
          }}
          className={"flex flex-col justify-center "}
        >
          <Input
          disabled={pending}
            required
            value={contact}
            type={"text"}
            onChange={(e) => setcontact(e.currentTarget.value)}
            placeholder={"contact number or email"}
          />
          <div className={"mt-4 "} />
          <textarea
            disabled={pending}
            required
            ref={textInput}
            className={
              "p-2 textarea textarea-primary bg-light min-h-[200px] border-2 rounded-3xl"
            }
            wrap="hard"
            placeholder={t("Write ...")}
          />

          <IonButton disabled={pending} type={"submit"}>
            {pending ? <IonSpinner/> : t("Send")}
          </IonButton>
        </form>
      </div>
    </IonModal>
  );
}
async function sendContactUs(value: { message: string; contact: string }) {
  const user_id = (await getuserid()) || "anon";
  return await supabase.from("feedbacks").insert({
    user_id,
    ...value,
    type: "casual",
  });
}
