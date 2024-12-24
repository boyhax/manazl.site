"use client";
import { createClient } from "@/app/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext<{ user: any }>({ user: null });

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
        setUser({ ...session.user, ...session.user.user_metadata })

      } else {
        setUser(null)
      }
    });
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export default UserContext;
