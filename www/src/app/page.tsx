'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import useSearchfilter from "@/hooks/useSearchFilter"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
// import MapComponent from "@/components/mapComponent"
import ListingsList from "@/components/listingsList"
import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import('@/components/mapComponent').then(s => s.default), { ssr: false })
export default function Component() {
  const { filter, updateFilter } = useSearchfilter<{ place_name: string, latlng: { lat: string, lng: string } }>()
  const [showMap, setShowMap] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Header filter={filter} updateFilter={updateFilter} />

      <main className="flex-grow bg-background flex flex-col items-center w-full text-center mt-7 mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className={`w-full md:w-1/2 lg:w-2/3 h-[75vh] ${showMap ? 'block' : 'hidden md:block'}`}>
            <MapComponent />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full md:w-1/2 lg:w-1/3 h-full relative justify-center">
            <ListingsList />
          </div>
        </div>

        <Button
          className="md:hidden bottom-7 fixed"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
      </main>

      <Footer />
    </div>
  )
}