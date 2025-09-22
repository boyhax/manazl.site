import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { useTranslate } from "@tolgee/react"
import { cn } from "@/lib/utils"

export function SearchBar() {
  const { t } = useTranslate()

  return (
    <div className="relative w-full max-w-sm lg:max-w-lg">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={t("Search properties...")}
        className={cn(
          "pl-8 rounded-full bg-muted",
          "border-none focus:outline-none focus:ring-0 active:outline-none focus-visible:ring-1 focus-visible:ring-primary "
        )}
      />
    </div>
  )
}