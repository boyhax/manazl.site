"use client"

import React from "react"
import { BiMenu } from "react-icons/bi"
import { cn } from "@/lib/utils"
import { Popover } from "@radix-ui/react-popover"
import { PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"



interface MapControlsProps {
  horizontal?: "left" | "right"
  vertical?: "top" | "bottom"
}

export default function MapMenu({
  horizontal = "right",
  vertical = "top",
}: MapControlsProps): React.JSX.Element {

  return (
    <div
      className={cn(
        "absolute z-[1000] flex flex-col gap-2",
        horizontal === "left" ? "left-4" : "right-4",
        vertical === "top" ? "top-4" : "bottom-4"
      )}
    >

      <div className="flex flex-col gap-2 w-fit">
        <Popover >
          <PopoverTrigger>
            <button
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Locate me"
            >
              <BiMenu className="text-xl text-gray-700" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 ms-2">
            <div className="space-y-1 flex flex-col gap-1">
              <Button variant="link">
                Account
              </Button>
              <Button variant="link">
                Chat
              </Button>
              <Button variant="link">
                Setting
              </Button>
            </div>
          </PopoverContent>
        </Popover>

      </div>
    </div>
  )
}