
import React, { useState } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import supabase from 'src/lib/supabase'

// Initialize Supabase client

export default function ImagePicker() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const takePicture = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      })

      if (image.base64String) {
        const file = await fetch(`data:image/jpeg;base64,${image.base64String}`)
          .then(res => res.blob())

        const fileName = `image_${Date.now()}.jpg`
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName)

        setImageUrl(publicUrl)
        setSuccess(true)
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.')
      console.error('Error uploading image:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        <Button 
          onClick={takePicture} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Take or Select Picture'
          )}
        </Button>

        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Uploaded" className="w-full rounded-md" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Image uploaded successfully!</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}