"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import supabase from "src/lib/supabase"

export default function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending OTP
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    })
    if (error) throw Error(error.message)
    console.log(`Sending OTP to ${phoneNumber}`)
    toast({
      title: "OTP Sent",
      description: `A 6-digit code has been sent to ${phoneNumber}`,
    })
    setIsOtpModalOpen(true)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate OTP verification
    console.log(`Verifying OTP: ${otp}`)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber, token: otp, type: "sms",
    })

    if (!error) { // This is a mock verification
      toast({
        title: "Authentication Successful",
        description: "You have been successfully logged in.",
      })
      setIsOtpModalOpen(false)
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid OTP. Please try again." + error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Send OTP
        </Button>
      </form>

      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              Please enter the 6-digit code sent to your phone.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}