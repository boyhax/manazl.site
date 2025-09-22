import { useState, useEffect } from 'react'
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'

export interface ImageFile {
  filepath: string;
  webviewPath: string;
}

export function useCapacitorImages() {
  const [images, setImages] = useState<ImageFile[]>([])

  useEffect(() => {
    return () => {
      // Clean up temporary files when component unmounts
      images.forEach(async (image) => {
        try {
          await Filesystem.deleteFile({
            path: image.filepath,
            directory: Directory.Data
          })
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      })
    }
  }, [images])

  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        quality: 100
      })

      const fileName = new Date().getTime() + '.jpeg'
      const savedFileImage = await savePicture(photo, fileName)
      
      setImages(prevImages => [...prevImages, savedFileImage])
      return savedFileImage
    } catch (error) {
      console.error('Error taking photo:', error)
      throw error
    }
  }

  const savePicture = async (photo: Photo, fileName: string): Promise<ImageFile> => {
    const base64Data = await base64FromPath(photo.webPath!)
    
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })

    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri)
    }
  }

  const base64FromPath = async (path: string): Promise<string> => {
    const response = await fetch(path)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject('method did not return a string')
        }
      }
      reader.readAsDataURL(blob)
    })
  }

  const removeImage = async (imageToRemove: ImageFile) => {
    try {
      await Filesystem.deleteFile({
        path: imageToRemove.filepath,
        directory: Directory.Data
      })
      setImages(prevImages => prevImages.filter(image => image.filepath !== imageToRemove.filepath))
    } catch (error) {
      console.error('Error removing image:', error)
      throw error
    }
  }

  const clearImages = async () => {
    try {
      await Promise.all(images.map(image => 
        Filesystem.deleteFile({
          path: image.filepath,
          directory: Directory.Data
        })
      ))
      setImages([])
    } catch (error) {
      console.error('Error clearing images:', error)
      throw error
    }
  }

  return {
    images,
    takePhoto,
    removeImage,
    clearImages
  }
}