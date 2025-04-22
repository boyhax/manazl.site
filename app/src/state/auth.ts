import { FCM } from "@capacitor-community/fcm";
import { Session } from "@supabase/supabase-js";
import { User, updateUser } from "src/lib/db/profile";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import supabase from "../lib/supabase";
import { isPlatform } from "@ionic/react";

export var session: Session;
interface Props {
  user: User | null;
  session: Session | null;
  loading: boolean;
  listings: any[];
  isHost: boolean;
}

export const auth = create<Props>()(
  devtools((set, get) => ({
    user: null,
    session: null,
    loading: false,
    listings: [],
    isHost: false,
  }))
);

export function authSubscripe(navigate) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == "PASSWORD_RECOVERY") {
      navigate("/changepassword");
    }
    // console.log('event, session :>> ', event, session);

    if (session) {
      // if (
      //   auth.getState().session &&
      //   session.expires_in != auth.getState().session.expires_in //new session
      // ) {

      // }
      isPlatform('hybrid')&& updateToken();
      auth.setState({
        session,
        user: { ...session.user.user_metadata, ...session.user } as any,
      });
    } else {
      auth.setState({ session: null, user: null });
    }
  });
}

async function updateToken() {
  const { token } = await FCM.getToken();
  if (!token) {
    console.log("no fcm token ");
    return;
  }

  const { error } = await updateUser({
    fcm_token: token,
  });
  console.log("profile token updated :>> ", error);
}

export function getuser() {
  return (
    auth.getState().user || {
      id: "",
      email: "",
      avatar_url: "",
      full_name: "",
      updated_at: new Date().toISOString(),
    }
  );
}
