"use client"

import React from "react"
import { Link } from "react-router-dom"
import { BiMenu } from "react-icons/bi"
import { cn } from "@/lib/utils"
import { Popover } from "@radix-ui/react-popover"
import { PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { User, CalendarDays, Search, Settings, MessageCircle } from "lucide-react"


type Tab = {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const tabs: Tab[] = [
  {
    id: "account",
    icon: <User className="w-5 h-5" />,
    label: "Account",
    path: "account",
  },
  {
    id: "reservations",
    icon: <CalendarDays className="w-5 h-5" />,
    label: "Reservations",
    path: "reservations",
  },
  {
    id: "search",
    icon: <Search className="w-5 h-5" />,
    label: "Search",
    path: "/",
  },

  {
    id: "settings",
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    path: "settings",
  },
  {
    id: "chat",
    icon: <MessageCircle className="w-5 h-5" />,
    label: "Chat",
    path: "chat",
  },
];

interface MapControlsProps {
  horizontal?: "left" | "right"
  vertical?: "top" | "bottom"
}

export default function ({
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
              {tabs.map(tab => {

                return (<Link to={tab.path}>
                  <Button className="gap-2" variant="ghost">
                    {tab.icon}
                    {tab.label}
                  </Button>
                </Link>)
              })}
            </div>

          </PopoverContent>
        </Popover>

      </div>
    </div>
  )
}