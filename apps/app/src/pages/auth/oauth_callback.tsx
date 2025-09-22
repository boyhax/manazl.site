import {
  IonContent,
  IonTitle,
  useIonToast
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Page from "src/components/Page";
import supabase from "src/lib/supabase";

export default function Callback() {
  const navigate= useNavigate();
  const [toast] = useIonToast();
  const [to, setTo] = useState("");
  //  https://manazl-web.vercel.app/oauth_callback?state=WBBJRk7q8AEgyB8GRZ6I&code=4%2F0AfJohXmbILhsl0geCfZqmuEOOp34VPhJyZkGa_i06qmY2PB9jNPblyYdePM0C3k0dh7uwg&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&authuser=0&prompt=none

  useEffect(() => {
    var params = new URLSearchParams(document.location.search);
    const error = params.get("error");
    const token = params.get("code");
    console.debug('error and token form oauth_callback => ',error," ",token);
    if (error) {
      console.log("/callback error :>> ", error);
      setTo("/");
    } else {
      if (token) {
         supabase.auth.exchangeCodeForSession(token)
        //  .then((res)=>{
        //   console.log('code exchange responce :>> ',JSON.stringify( res)); 
        //  })
        // supabase.auth
        //   .signInWithIdToken({
        //     provider: "google",
        //     token,
        //   })
          .then(({ data, error }) => {
            if (error) {
              setTo("/");
              console.log(" sign in with token error=>", error);
            } else {
              setTo("/account");
            }
          })
          .catch((error) => {
            setTo("/home");
            console.log(" sign in with token catch error=>", error);

            toast("failed at sign in attempt", 1000);
          });
      } else {
        setTo("/home");
      }
    }
  }, []);

  return (
    <Page>
      {to && <Navigate to={to} />}
      <IonContent>
        <IonTitle>Please Wait..</IonTitle>
      </IonContent>
    </Page>
  );
}
