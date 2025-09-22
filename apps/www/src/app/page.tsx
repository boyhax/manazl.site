'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import useSearchfilter from "@/hooks/useSearchFilter"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
// import MapComponent from "@/components/mapComponent"
import ListingsList from "@/components/listingsList"
import dynamic from "next/dynamic"
import GoogleOneTab from "./login/googleOnTab"
import { createClient } from "./lib/supabase/client"

const MapComponent = dynamic(() => import('@/components/mapComponent').then(s => s.default), { ssr: false })
export default function Component() {

  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)

  const [showMap, setShowMap] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow bg-background flex flex-col items-center w-full text-center mt-7 mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className={`w-full md:w-1/2 h-[75vh] rounded-xl overflow-hidden ${showMap ? 'block' : 'hidden md:block'}`}>
            <MapComponent />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 grow  h-full relative justify-center">
            <ListingsList />
          </div>
        </div>
              <GoogleOneTab/>

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