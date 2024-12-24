"use client"

import React from "react"
import { cn } from "@/lib/utils"



interface MapControlsProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  horizontal?: "left" | "right"
  vertical?: "top" | "bottom"
}

export default function ({
  horizontal = "right",
  vertical = "top",
  children,
  className,
  ...props

}: MapControlsProps): React.JSX.Element {

  return (
    <div
      className={cn(
        "absolute z-[1000] flex flex-col gap-2",
        horizontal === "left" ? "left-4" : "right-4",
        vertical === "top" ? "top-4" : "bottom-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}