import { useState } from "react";
import { XIcon, CameraIcon, PlusIcon } from "lucide-react";

import { pickImages, TFile } from "src/lib/utils/imagePicker";
import { Button } from "./ui/button";

export default function ImagePicker({ files, oldImagesUrls, onFilesChange, onRemoveOldImage }: {
  onFilesChange?: (files: TFile[]) => void;
  files: TFile[];
  onRemoveOldImage?: (url: string) => void;
  oldImagesUrls: string[];
}) {
  async function handlePickImages() {
    const pickedPhotos = await pickImages();
    onFilesChange([...files, ...pickedPhotos]);
  }

  const handleRemoveNewImage = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    onFilesChange(updatedFiles);
  };

  const handleRemoveOldImage = (url: string) => {
    if (onRemoveOldImage) {
      onRemoveOldImage(url);
    } else {
      // If no explicit handler is provided, filter it out from the list
      const filteredUrls = oldImagesUrls.filter(imgUrl => imgUrl !== url);
      // Update parent component somehow, this depends on implementation
    }
  };

  const count = oldImagesUrls.length + files.length;
  
  return (
    <div className="w-full">
      {/* Preview Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            Images <span className="text-sm text-gray-500">({count})</span>
          </h2>
          <Button 
            onClick={handlePickImages} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            Add Images
          </Button>
        </div>
        
        {count > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
            {files.map((photo, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="relative w-full aspect-square overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={photo.path}
                    alt={`Upload preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
                  <button 
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <XIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
            
            {oldImagesUrls.map((photo, index) => (
              <div key={`old-${index}`} className="relative group">
                <div className="relative w-full aspect-square overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={photo}
                    alt={`Existing image ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
                  <button 
                    onClick={() => handleRemoveOldImage(photo)}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <XIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 p-8 border-2 border-dashed border-gray-300 rounded-md">
            <CameraIcon className="h-12 w-12 mb-3 text-gray-400" />
            <p className="text-sm">No images selected</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Images" to upload</p>
          </div>
        )}
      </div>
    </div>
  );
}
