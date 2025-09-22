'use client'

import { Search, X, MapPin, Menu } from "lucide-react"
import { useTranslate } from "@tolgee/react"
import useSearchfilter from "@/hooks/useSearchFilter"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { UserNav } from "./user-nav"
import Dbsearch from "../dbsearch"
import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { filter, updateFilter } = useSearchfilter<{
    place_name: string;
    latlng: { lat: string; lng: string };
  }>();
  const { t } = useTranslate();

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between bg-white/80 backdrop-blur-md rounded-full my-4 px-4 shadow-sm ring-1 ring-gray-900/5">
          {/* Left Section: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col gap-4 pt-8">
                 
                  <Link href="/blog" className="text-sm font-medium hover:text-primary">
                    Blog
                  </Link>
                  <Link href="/about" className="text-sm font-medium hover:text-primary">
                    About
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-primary">
                Manazl
              </span>
            </Link>
          </div>

          {/* Center Section: Navigation & Search */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <nav className="flex items-center gap-6">
             
              <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                About
              </Link>
            </nav>

            <div className="relative w-64">
              <div className={cn(
                "flex items-center gap-2 w-full rounded-full border border-gray-200",
                "bg-white/50 px-4 py-2 shadow-sm transition-all",
                "hover:shadow-md focus-within:shadow-md focus-within:border-primary"
              )}>
                <Search className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <Dbsearch
                  placeholder={filter.place_name || t('Search city, hotel..')}
                  className="w-full border-0 bg-transparent focus:ring-0 p-0 placeholder:text-gray-500"
                  onChange={(value) => {
                    const [lng, lat] = JSON.parse(value.point).coordinates;
                    updateFilter({
                      place_name: value.name,
                      latlng: { lat, lng },
                    });
                  }}
                />
                {filter.place_name && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full hover:bg-gray-100"
                    onClick={() => updateFilter({ place_name: undefined, latlng: undefined })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* {filter.place_name && (
                <div className="absolute top-full mt-2 w-full rounded-lg bg-white p-2 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{filter.place_name}</span>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          {/* Right Section: User Nav */}
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}