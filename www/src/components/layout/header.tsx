'use client'

import { BiCloset, BiSearch } from "react-icons/bi"
import Nav from "@/components/layout/nav"
import Dbsearch from "@/components/dbsearch"
import { useTranslate } from "@tolgee/react"
import { Button } from "../ui/button"
import { X } from "lucide-react"

export default function Header({ filter, updateFilter }) {
  const { t } = useTranslate()

  return (
    <header className="w-full h-16 border-b px-4 items-center flex justify-between bg-white shadow-sm">

      <div className="flex flex-row items-center gap-4 flex-grow">
        <div className=" text-start hidden sm:block">
          <h1 className="text-3xl font-bold text-primary  bg-clip-text ">
            Manazl
          </h1>
          <p>Explore Essence of Oman</p>
        </div>

        <div className="sm:hidden">
          <h1 className="text-2xl font-bold text-primary">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              M
            </span>
          </h1>
        </div>

        <div className="flex flex-row relative w-full sm:mx-6 my-7 max-w-sm items-center gap-1 justify-between rounded-full border shadow-sm border-slate-500 p-2">
          <BiSearch size={"1.5rem"} />
          <div className="flex grow h-full items-center flex-row">
            <Dbsearch
              placeholder={filter.place_name || t('Search city, hotel ..')}
              className="w-full border-none ring-0 outline-none"
              onChange={(value) => {
                const [lng, lat] = JSON.parse(value.point).coordinates;
                updateFilter({
                  place_name: value.name,
                  latlng: { lat, lng },
                });
              }}
            />
            {<Button className="absolute right-2 top-1 bottom-2" onClick={() => {
              updateFilter({
                place_name: undefined,
                latlng: undefined,
              });
            }} variant={'ghost'}><X /></Button>}
          </div>
        </div>
        <Nav />
      </div>

    </header>
  )
}