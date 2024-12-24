"use client";
import { createClient } from "@/app/lib/supabase/client";

const supabase = createClient();

export async function getuserid() {
  return (await supabase.auth.getUser())?.data?.user?.id ?? null;
}
export function GoogleSignIn() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: location.origin + `/login/callback`,
    },
  });
}
export async function SignOut() {
  return await supabase.auth.signOut();
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
