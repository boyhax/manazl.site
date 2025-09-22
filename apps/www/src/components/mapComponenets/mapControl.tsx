"use client"

import React, { useEffect, useState } from "react"
import { LatLng } from "leaflet"
import { useMapEvents } from "react-leaflet"
import { BiCurrentLocation } from "react-icons/bi"
import { useMediaQuery } from "usehooks-ts"
import MapSearchBar from "src/components/MapSearchBar"
import { cn } from "@/lib/utils"
import { getPosition } from "src/lib/utils/getPosition"



interface MapControlsProps {
  horizontal?: "left" | "right"
  vertical?: "top" | "bottom"
}

export function MapControls({
  horizontal = "right",
  vertical = "top",
}: MapControlsProps): React.JSX.Element {
  const map = useMapEvents({})




  const moveToPosition = (pos: { lat: number; lng: number }) => {
    try {
      let to = new LatLng(pos.lat, pos.lng)
      map.flyTo(to, 15)
    } catch (error) {
      console.log("error from move to position on map controls :>> ", error)
    }
  }



  const locate = async () => {
    const location = await getPosition()
    if (location) {
      let position = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      }
      moveToPosition(position)


    }
  }

  return (
    <div
      dir={'ltr'}
      className={cn(
        "absolute z-[900] flex flex-col gap-2 items-end",
        horizontal === "left" ? "left-4" : "right-4",
        vertical === "top" ? "top-4" : "bottom-4"
      )}
    >
      <MapSearchBar />
      <div className="flex  flex-col gap-2 w-fit">

        <button
          onClick={locate}
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Locate me"
        >
          <BiCurrentLocation className="text-xl text-gray-700" />
        </button>
      </div>
    </div>
  )
}