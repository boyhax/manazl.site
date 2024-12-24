import { useIonLoading, useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { GoogleSignIn, SignIn, SignOut, SignUp } from "src/lib/db/auth";
import getPathTo from "src/lib/utils/getPathTo";
import supabase from "../lib/supabase";
import { auth } from "../state/auth";

export default function useAuth() {
  const s = auth();
  const {t} =useTranslate()
  const [loading, stoploading] = useIonLoading();
  const [toast] = useIonToast();

  async function Signout() {
    loading();
    const {error} = await SignOut();
    stoploading();
    error && toast(t(error.message),1000)
  }

  async function googleSignin() {
    
    const {data,error} = await GoogleSignIn()
    if (error) {
      toast( t(error.message), 1000);
    } else {
      // toast("redirecting you to sign in", 1000);
    }
  }
  const ResetPassword = async (email:string) => {
    const redirectTo = getPathTo('resetpassword')
      loading();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      stoploading();
      error && toast(t(error.message), 1000);
      !error && toast(t("please find reset link in your email"), 1000);
    

  };
  async function signIn(password: string, email: string ) {
    loading();
    const {error} = await SignIn(email,password)
    toast(error? t(error.message):t("seccesfuly sign in"), 1000);
    
    stoploading();
    return error
  }

  async function signUp(
    password: string,
    email: string,
    full_name: string,
    mobile: string
  ) {
    loading();
    const {error} = await SignUp(password, email, full_name, mobile,`https://ui-avatars.com/api/?name=${full_name||"MA"}&background=0D8ABC&color=fff`);
    toast(error? t(error.message):t("seccesfuly sign Up"), 1000);
    stoploading();
  }

  return { ...s, signIn, signUp, googleSignin, Signout,ResetPassword };
}
