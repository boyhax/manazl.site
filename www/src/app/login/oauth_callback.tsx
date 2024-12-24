
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinnerComponent from "react-spinners-components";
import Page from "src/components/Page";
import supabase from "src/lib/supabase";

export default function Callback() {
  const navigate = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    var params = new URLSearchParams(document.location.search);
    const error = params.get("error");
    const token = params.get("code");
    console.debug('error and token form oauth_callback => ', error, " ", token);
    if (error) {
      console.log("/callback error :>> ", error);
      navigate.push("/");
    } else {
      if (token) {
        supabase.auth.exchangeCodeForSession(token)
          .then(({ data, error }) => {
            if (error) {
              navigate.push("/");
              console.log(" sign in with token error=>", error);
            } else {
              navigate.push("/account");
            }
          })
          .catch((error) => {
            navigate.push("/");
            console.log(" sign in with token catch error=>", error);
            toast({ title: "failed at sign in attempt", duration: 1000 });
          });
      } else {
        navigate.push("/");
      }
    }
  }, []);

  return (
    <Page>
      <div className="p-10">
        <LoadingSpinnerComponent />
      </div>
    </Page>
  );
}
