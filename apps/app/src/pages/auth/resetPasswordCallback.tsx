import {
  IonContent,
  IonProgressBar,
  useIonToast
} from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Page from "src/components/Page";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import { object, string } from "yup";

const validationSchema = object({
  password: string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});
export default function ResetPassword() {
  const navigate = useNavigate();
  const { session } = auth();
  const [toast] = useIonToast();
  const { t } = useTranslate();
  useEffect(() => {
    var params = new URLSearchParams(document.location.hash);
    const error = params.get("#error");
    const token = params.get("#access_token");
    console.log("token error from reset password  :>> ", token, error);
    if (token) {
      supabase.auth
        .exchangeCodeForSession(token)
        .then(() => {
          navigate("/changepassword");
        })
        .catch((error) => {
          console.trace(error);
          navigate("/");
        });
    } else {
      if (error) {
        console.trace(error);
        toast(t("reset session time out"), 1500);
      }
    }
  }, []);

  if (!session) {
    navigate("..");
  } else {
    navigate("/changepassword");
  }
  return (
    <Page>
      <IonContent>
        <IonProgressBar type={"indeterminate"} />
      </IonContent>
    </Page>
  );
}
