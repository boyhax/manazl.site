'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star } from 'lucide-react'
import Image from "next/image"
import { CgClose } from "react-icons/cg"

import { useMediaQuery } from 'usehooks-ts'

interface Listing {
    short_id: string,
    id: string
    title: string
    images: string[]
    rating: number
    cost: number
    type: string
    likes: any[]
}

type MapListingProps = {
    title: string, id: string, rooms: any[], rating: number, images: string[], type: string
}
interface MapListingPreviewProps {
    selected: MapListingProps
    onClose: () => void
}
function get_cost(rooms: any) {
    let cost: any = null;
    rooms.forEach((room: any) => {
        room.available.forEach((available: any) => {
            if (!cost || available.cost < cost) {
                cost = available.cost
            }
        })


    })

    return cost

}
export default function MapListingCard({ selected, onClose }: MapListingPreviewProps) {
    const scrrenlarge = useMediaQuery("(min-width: 768px)");
    let cost = get_cost(selected.rooms || [])
    return (
        <div className={`fixed inset-x-0 bottom-16 z-50 px-4 max-w-md  ${scrrenlarge ? "me-auto" : "mx-auto"}`}>
            <Card className="overflow-hidden">
                <div className="relative">
                    <Carousel dir={'ltr'} className="w-full">
                        <CarouselContent>
                            {selected.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="aspect-video relative">
                                        <Image
                                            width={414} height={323}
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


                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 left-2 bg-white/50 backdrop-blur-sm hover:bg-white/75 transition-colors"
                        onClick={onClose}
                    >
                        <CgClose />
                    </Button>
                </div>
                {/* <Link href={"/listing/" + selected.short_id}> */}
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
                        <p dir={'ltr'} className="font-semibold">
                            {cost}
                            <span className="text-sm font-normal">$</span>
                        </p>
                    </div>
                </CardContent>
                {/* </Link> */}
            </Card>
        </div>
    )
}