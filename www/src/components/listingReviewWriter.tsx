'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star } from 'lucide-react'
import { toast } from 'src/hooks/use-toast'

interface ReviewWriterProps {
  listingId: string
  onSubmit: () => void
  onFail: () => void
}

export default function ReviewWriter({ listingId, onSubmit, onFail }: ReviewWriterProps) {
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Replace this with your actual API call
      await submitReview(listingId, rating, review)
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      })
      onSubmit()
    } catch (error) {
      console.error('Failed to submit review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
      onFail()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="rating" className="text-lg font-semibold">Rating</Label>
        <RadioGroup
          id="rating"
          className="flex space-x-2 mt-2"
          value={rating.toString()}
          onValueChange={(value) => setRating(parseInt(value))}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex items-center">
              <RadioGroupItem
                value={value.toString()}
                id={`rating-${value}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`rating-${value}`}
                className="peer-data-[state=checked]:text-primary cursor-pointer"
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= rating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'
                  }`}
                />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="review" className="text-lg font-semibold">Your Review</Label>
        <Textarea
          id="review"
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="mt-2"
          rows={5}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}

// This function should be replaced with an actual API call
async function submitReview(listingId: string, rating: number, review: string) {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Review submitted:', { listingId, rating, review })
      resolve(true)
    }, 1000)
  })
}