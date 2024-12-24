'use client'
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignOut } from "@/lib/db/auth";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import NotificationsSummary from "../notification-summary";
import { useUserContext } from "@/providers/userProvider";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/app/lib/supabase/client";


export default function Nav() {
  const router = useRouter()
  const { user } = useUserContext();


  return (
    <nav className="flex flex-row gap-1 sm:gap-4 items-center">
      <div className="flex  flex-row  gap-1">
        {user &&

          <Button variant="ghost" onClick={() => router.push('/account')}>
            <Avatar className="w-7 h-7">
              <AvatarImage src={user?.avatar_url}></AvatarImage>
              <AvatarFallback>{user.full_name.slice(0, 2) || "M"}</AvatarFallback>
            </Avatar>
            Account
          </Button>
        }
        <Button variant="ghost" onClick={user ? SignOut : () => router.push('/login')}>{user ? "Sign Out" : "Sign in"}</Button>

      </div>

      <NotificationsButton />


    </nav>
  )
}

function NotificationsButton() {

  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const client = createClient()
      const { data, error } = await client
        .from('notifications')
        .select()
        .limit(5)
        .order('created_at', { ascending: false })
      if (error) throw Error(error.message)
      return data
    }
  })
  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <Popover
      open={open} onOpenChange={setOpen}
    >
      <PopoverTrigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <Button variant={'ghost'} className="relative">
          {data?.length &&
            <div className="absolute  -left-0 -top-1 rounded-full p-1 " >
              {data.length}</div>}
          <Bell />
        </Button>

      </PopoverTrigger>
      <PopoverContent
        className="z-[100000]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NotificationsSummary data={data as any} isLoading={isLoading} />
      </PopoverContent>
    </Popover>
  )
}