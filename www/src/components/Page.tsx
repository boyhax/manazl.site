'use client'
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ScrollArea } from "./ui/scroll-area"

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export default function Page({ children, className, ...props }: PageProps) {
  return (
    <div className={cn("pb-[var(--safe-margin-bottom,0px)] w-screen h-screen", className)} {...props}>
      {children}
    </div>
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
  const navigate = useRouter()

  const handleClick = () => {
    if (to) {
      navigate.push(to)
    } else {
      navigate.back()
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
      {dir == 'ltr' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      <span className="sr-only">Go back</span>
    </Button>
  )
}

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Footer({ children, className, ...props }: FooterProps) {
  return (
    <footer
      className={cn("border-t bg-background fixed bottom-0 max-w-sm", className)}
      {...props}
    >
      <div className="container flex h-14 items-center">
        {children}
      </div>
    </footer>
  )
}

export function MainContent({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("flex-1", className)} {...props}>
      <div className="container">
        <ScrollArea>
          {children}
        </ScrollArea>
      </div>
    </div>
  )
}
