'use client'

import { useTranslate } from "@tolgee/react"
import { Bell, Calendar, Heart, Home, Settings, User } from "lucide-react"
import { useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinnerComponent from "react-spinners-components"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import useProfile from "src/hooks/useProfile"
import { getuserid, SignOut } from "src/lib/db/auth"
import supabase from "src/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useUserContext } from "@/providers/userProvider"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ChangePasswordCard from "../login/ChangePasswordCard"
import { useRouter } from "next/navigation"


async function accountLoader() {
  const id = await getuserid()
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `listings(count),reservations(count),likes(count),notifications(count)`
    )
    .eq("id", id)
    .gte('reservations.start_date', new Date().toDateString())
    .single()
  if (error) throw Error(error.message)

  return data
}

export default function AccountPage() {
  const { user } = useUserContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ["account"],
    queryFn: accountLoader,
    enabled: !!user,
  })

  const [name, setName] = useState(user ? user.full_name : "name")

  const { updateAvatar, updateProfile, loading } = useProfile()
  const { toast } = useToast()
  const { t } = useTranslate()
  const router = useRouter()
  const handleAvatarUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateAvatar(file)
    }
  }
  function handleProfileSave() {
    if (name && name.length > 5) {
      updateProfile({ full_name: name })
      toast({ title: "Profile updated successfully", duration: 2000 })
    } else {
      toast({ title: "Name should be more than 5 characters", duration: 2000 })
    }
  }

  if (isLoading || !user) return <LoadingSpinnerComponent type="Ball" />


  return (

    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar_url!} alt={name} />
              <AvatarFallback>
                {(name || "ma").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.full_name!}</CardTitle>
              <CardDescription>
                {user.email||user.phone||""}
              </CardDescription>
              <CardDescription>
                {t("Joined")} {user?.created_at ? format(new Date(user?.created_at), "MMMM yyyy") : null}
              </CardDescription>

            </div>
            <Button variant="outline" onClick={() => { SignOut(); router.push('/') }}>{user ? "Sign Out" : "Sign in"}</Button>

          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                {<span className="hidden sm:visible"> {t("Edit Profile")}</span>}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t("Edit Profile")}</SheetTitle>
                <SheetDescription>
                  {t("Make changes to your profile here")}
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("Name")}</Label>
                  <Input
                    id="name"
                    value={name}
                    maxLength={20}
                    onChange={(e) => setName(e.target.value.slice(0, 20))}
                  />
                </div>
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant={'outline'}>{t("change password")}</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <ChangePasswordCard />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">{t("Avatar")}</Label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="icon"
                      variant="outline"
                      disabled={loading}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar_url} alt={name} />
                        <AvatarFallback>
                          {(name || "ma").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpdate}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={handleProfileSave} type="submit">
                    {t("Save changes")}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardHeader>
      </Card>




      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Account Overview")}</CardTitle>
            <CardDescription>
              {t("Quick summary of your account")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-4 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-semibold">
                    {data?.reservations[0]?.count!}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Upcoming Reservations")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <Home className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-semibold">
                    {data?.listings[0].count}

                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Active Listings")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <User className="h-8 w-8 text-purple-500" />
                <div>
                  {<p className="font-semibold">
                    {data?.listings.length && data?.listings[0].count > 0 ? t("Host") : t("Guest")}
                  </p>}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Account Type")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                <Heart className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-semibold">
                    {data?.likes[0].count}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Liked Listings")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <Bell className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-semibold">
                    {data?.notifications[0].count}

                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Notifications")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



    </div>

  )
}