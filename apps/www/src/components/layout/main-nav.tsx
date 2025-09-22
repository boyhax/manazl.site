import Link from "next/link"
import { useTranslate } from "@tolgee/react"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { t } = useTranslate()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/properties"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {t("Properties")}
      </Link>
      <Link
        href="/blog"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {t("Blog")}
      </Link>
      <Link
        href="/about"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        {t("About")}
      </Link>
    </nav>
  )
}