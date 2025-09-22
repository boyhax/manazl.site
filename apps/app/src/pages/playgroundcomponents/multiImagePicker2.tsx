import React, { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ImageFile extends File {
  preview: string;
}

export default function MultiImagePicker() {
  
  const [images, setImages] = useState<ImageFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))
    setImages(prevImages => [...prevImages, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    const newImages = files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))
    setImages(prevImages => [...prevImages, ...newImages])
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-background rounded-lg shadow-md">
      <div
        className="border-2 border-dashed border-primary/50 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag and drop images here, or click to select files
        </p>
      </div>

      {images.length > 0 && (
        <ScrollArea className="h-72 mt-4 rounded-md border">
          <div className="p-4 grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`preview ${index}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? 'image' : 'images'} selected
        </p>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Add More
        </Button>
      </div>
    </div>
  )
}