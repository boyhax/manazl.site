import supabase from "src/lib/supabase";
import getPathTo from "../utils/getPathTo";
import { SocialLogin } from "@capgo/capacitor-social-login";

export async function getuserid() {
  return (await supabase.auth.getUser())?.data?.user?.id ?? null;
}
// await SocialLogin.initialize({
//   google: {
//     webClientId:
//       "202404083933-k5hccrktt6hopmjoa30k0j7kq80h4smc.apps.googleusercontent.com", // the web client id for Android and Web
//   },
// });

export async function GoogleSignIn() {
  try {

    // const res = await SocialLogin.login({
    //   provider: "google",

    //   options: {
    //     grantOfflineAccess: true,

    //     scopes: ["email", "profile"],
    //   },
    // });
    // console.log("res :>> ", JSON.stringify(res.result));
    // console.log(
    //   "access token from auth model oauth sign in => ",
    //   JSON.stringify(auth)
    // );
    // return supabase.auth.signInWithIdToken({
    //   provider: "google",
    //   access_token: auth.authentication.accessToken,
    //   token: auth.authentication.idToken,
    // });
  } catch (error) {
    console.log("error GoogleSignIn:>> ", JSON.stringify(error));
    return {
      data: null,
      error: { message: error.message || JSON.stringify(error) },
    };
  }
}
export async function SignOut() {
  return supabase.auth.signOut();
}

export async function SignIn(email: string, password: string) {
  try {
    return supabase.auth.signInWithPassword({ email: email.trim(), password });
  } catch (error) {
    console.log("error :>> ", error);

    return { data: null, error: { message: "error sign in" } };
  }
}
export async function SignUp(
  password: string,
  email: string,
  full_name: string,
  phone?: string,
  avatar_url?: string
) {
  try {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getPathTo(""),
        data: {
          phone,
          full_name,
          avatar_url,
          email,
        },
      },
    });
  } catch (error) {
    console.log("error :>> ", error);
    return { data: null, error: { message: "error sign up" } };
  }
}
