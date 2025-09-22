
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/providers/userProvider";
import { useTranslate } from "@tolgee/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinnerComponent from "react-spinners-components";
import Page from "src/components/Page";
import supabase from "src/lib/supabase";
import { object, string } from "yup";


export default function ResetPassword() {
  const navigate = useRouter();
  const { user } = useUserContext();
  const { toast } = useToast();
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
          navigate.push("/changepassword");
        })
        .catch((error) => {
          console.trace(error);
          navigate.push("/");
        });
    } else {
      if (error) {
        console.trace(error);
        toast({ title: t("reset session time out"), duration: 1500 });
      }
    }
  }, []);

  if (!user) {
    navigate.push("..");
  } else {
    navigate.push("/changepassword");
  }
  return (
    <Page>
      <div className="p-10">
        <LoadingSpinnerComponent />
      </div>
    </Page>
  );
}
