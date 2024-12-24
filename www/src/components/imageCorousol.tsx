'use client'
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

export default function ImageCorousol({ images }: { images: string[] }) {
  return (
    <Carousel dir="ltr" className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              width={680} height={270}
              src={image}
              alt={`Listing image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={"start-5 "} />
      <CarouselNext className={"end-5 "} />
    </Carousel>
  );
}
