'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";


export default function ImageCorousol2({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative aspect-video overflow-hidden">
      <Image
        width={300} height={300}
        src={images[currentImageIndex]}
        alt={`Listing image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
        {currentImageIndex + 1} / {images.length}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={prevImage}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={nextImage}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  );
}
