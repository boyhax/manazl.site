'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { IonSpinner } from "@ionic/react"
import { useTranslate } from "@tolgee/react"
import { Star } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LikeButton from 'src/components/LikeButton'
import { useCurrency } from "src/hooks/useCurrency"
import useRooms from "src/hooks/useRooms"
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts'

interface Listing {
  short_id,
  id: string
  title: string
  images: string[]
  rating: number
  cost: number
  type: string
  likes: any[]
}

interface MapListingPreviewProps {
  selected: Listing | null
  onClose: () => void
}
function get_cost(data: { listing_id: string, rooms: { total_cost: number }[] }[]) {
  let cost = null;
  data.forEach((value, index, array) => {

    value.rooms.forEach((room, index, array) => {

      if (!cost || room.total_cost < cost) {
        cost = room.total_cost
      }
    })
  })

  return cost

}
export default function MapListingPreview({ selected, onClose }: MapListingPreviewProps) {
  const { t } = useTranslate()
  const containerRef = useRef()
  const { currency, converted } = useCurrency()
  useOnClickOutside(containerRef, onClose)
  const [isLiked, setIsLiked] = useState(!!selected.likes)
  const scrrenlarge = useMediaQuery("(min-width: 768px)");
  const { data, isLoading } = useRooms({ id: selected.id })
  let cost = !!data ? get_cost(data) : undefined;

  return (
    <div ref={containerRef} className={`fixed inset-x-0 bottom-16 z-50 px-4 max-w-md  ${scrrenlarge ? "me-auto" : "mx-auto"}`}>
      <Card className="overflow-hidden">
        <div className="relative">
          <Carousel dir={'ltr'} className="w-full">
            <CarouselContent>
              {selected.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video relative">
                    <img
                      src={image}
                      alt={`Listing image ${index + 1}`}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
          <LikeButton
            id={selected.id}
            isliked={isLiked}
            className="absolute top-2 right-2 text-white hover:bg-white/20"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-white/50 backdrop-blur-sm hover:bg-white/75 transition-colors"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <Link to={"/listing/" + selected.short_id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold line-clamp-2">{selected.title}</h3>
              <div className="flex items-center bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm">
                <Star className="w-4 h-4 mr-1" />
                {(selected.rating / 20).toFixed(2)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Badge variant="secondary">{selected.type}</Badge>
              {isLoading ?
                <IonSpinner />
                : <Link to={"/listing/" + selected.short_id}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="transition-transform hover:scale-105"
                  >{cost ?
                    <p>
                      {currency}{converted(cost)}{' '}
                      {t("Book Now")} </p>
                    : t("Check Availablity")}
                  </Button>
                </Link>}
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  )
}