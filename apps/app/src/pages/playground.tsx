import { Capacitor } from '@capacitor/core';
import { useState } from 'react';
import ImagePicker from 'src/components/ImagePicker';
import { Button } from 'src/components/ui/button';
import { useImageUpload } from 'src/hooks/useImageUpload';
import supabase from 'src/lib/supabase';
import { TFile, pickImages } from 'src/lib/utils/imagePicker';
import { auth } from 'src/state/auth';

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [path, setPath] = useState("test");
  const { user } = auth();
  const [photos, setPhotos] = useState<TFile[]>([]);

  const { 
    uploadFiles, 
    isUploading, 
    uploadError 
  } = useImageUpload(user?.id || '', path);

 

  const handleUpload = () => {
    uploadFiles(photos, {
      onSuccess: (data) => {
        setImages((prevImages) => [
          ...prevImages,
          ...data.map((item) => item),
        ]);
      }
    });
  }

  return (
    <div className='App bg-gray-50 min-h-screen'>
      <header className="bg-white shadow-sm py-4 px-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Image Upload Playground</h1>
      </header>
      <Button onClick={handleUpload}>Upload Images</Button>

      <main className="container mx-auto px-4 pb-12">
        <ImagePicker
          files={photos}
          oldImagesUrls={images}
          onFilesChange={setPhotos}
          onRemoveOldImage={(url) => {
            setImages((prevImages) => prevImages.filter((image) => image !== url));
          }}
        />
      </main>
    </div>
  );
}
