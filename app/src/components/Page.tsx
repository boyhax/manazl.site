
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IonFooter, IonPage } from "@ionic/react"

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export default function Page({ children, className, ...props }: PageProps) {
  return (
    <IonPage className={cn("", className)} {...props}>
      {children}
    </IonPage>
  )
}

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Header({ children, className, ...props }: HeaderProps) {
  return (
    <div
      className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}
      {...props}
    >
      <div className="container flex h-14 items-center justify-start">
        {children}
      </div>
    </div>
  )
}

interface HeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { }

export function HeaderTitle({ className, ...props }: HeaderTitleProps) {
  return (
    <h1
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

interface HeaderBackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string, dir?: string
}

export function HeaderBackButton({ to, dir, className, ...props }: HeaderBackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("mx-2", className)}
      onClick={handleClick}
      {...props}
    >
      {dir == 'ltr' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      <span className="sr-only">Go back</span>
    </Button>
  )
}

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Footer({ children, className, ...props }: FooterProps) {
  return (
    <IonFooter
      className={cn("border-t bg-background", className)}
      {...props}
    >
      <div className="container flex h-14 items-center">
        {children}
      </div>
    </IonFooter>
  )
}

export function MainContent({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <main className={cn("flex-1", className)} {...props}>
      <div className="container py-6 overflow-hidden">
        {children}
      </div>
    </main>
  )
}
