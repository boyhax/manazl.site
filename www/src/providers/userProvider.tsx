"use client";
import { createClient } from "@/app/lib/supabase/client";
import { User as supaUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useState, useContext, useEffect } from "react";

type UserMetaData = {
  full_name:string,avatar_url:string
}
export type User=supaUser & UserMetaData

const UserContext = createContext<{ user: User|null }>({ user: null });

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        router.push("/changepassword");
      }
      if (session) {
        setUser({ ...session.user, ...session.user.user_metadata as UserMetaData })

      } else {
        setUser(null)
      }
    });
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export default UserContext;
