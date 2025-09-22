"use client"

import React, { useEffect, useState } from "react"
import { latLng, LatLng, latLngBounds } from "leaflet"
import { useMapEvents } from "react-leaflet"
import { useNavigate } from "react-router-dom"
import { BiChevronLeft, BiCurrentLocation } from "react-icons/bi"
import { useMediaQuery } from "usehooks-ts"
import MapSearchBar from "src/components/MapSearchBar"
import { cn } from "@/lib/utils"
import { getPosition } from "src/lib/utils/getPosition"


interface MapButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {

}


export function MapButton({
  children,
  className,
  ...props
}: MapButtonProps): React.JSX.Element {

  return (
    <button
      className={cn(["bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", className])}
      {...props}
    >
      {children}
    </button>

  )
}