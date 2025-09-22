import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";

export default async function ({ children }) {

    const supa = createClient()
    const { data: { user } } = await supa.auth.getUser()
    if (user) {
        if (user.email && !user.phone && !user.email_confirmed_at) {
            redirect('/confirm')    
        }
        redirect('/')
    }
    return children

}