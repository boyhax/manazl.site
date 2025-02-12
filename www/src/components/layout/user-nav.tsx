import { useUserContext } from "@/providers/userProvider"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useTranslate } from "@tolgee/react"
import { SignOut } from "@/lib/db/auth"

export function UserNav() {
  const { user } = useUserContext()
  const router = useRouter()
  const { t } = useTranslate()

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => router.push('/login')}>
          {t("Sign in")}
        </Button>
        <Button 
          onClick={() => router.push('/register')}
          className=" text-white hover:opacity-90"
        >
          {t("Sign up")}
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback>{user.full_name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/account')}>
          {t("Account")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/account/reservations')}>
          {t("Reservations")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/account/myhost')}>
          {t("Manage Host")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={SignOut} className="text-red-600">
          {t("Log out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}