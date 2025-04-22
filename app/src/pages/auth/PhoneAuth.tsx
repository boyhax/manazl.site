import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import supabase from "src/lib/supabase"
import { motion } from "framer-motion"
import { PhoneIcon, ArrowLeftIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define country codes
const countryCodes = [
  { code: "+968", country: "OM", name: "Oman" },
  { code: "+971", country: "AE", name: "UAE" },
  { code: "+966", country: "SA", name: "Saudi Arabia" },
  { code: "+974", country: "QA", name: "Qatar" },
  { code: "+965", country: "KW", name: "Kuwait" },
  { code: "+973", country: "BH", name: "Bahrain" },
  { code: "+20", country: "EG", name: "Egypt" },
  { code: "+962", country: "JO", name: "Jordan" },
  { code: "+961", country: "LB", name: "Lebanon" },
]

export default function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+968")
  const [otp, setOtp] = useState("")
  const [isFlipped, setIsFlipped] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0 && isFlipped) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer, isFlipped])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const fullPhoneNumber = countryCode + phoneNumber.replace(/^0+/, '')
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      })
      
      if (error) throw Error(error.message)
      
      toast({
        title: "Code sent",
        description: `OTP sent to ${fullPhoneNumber}`,
      })
      
      setIsFlipped(true)
      setTimer(30) // Start 30 second timer for resend
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: countryCode + phoneNumber.replace(/^0+/, ''), 
        token: otp, 
        type: "sms",
      })

      if (error) throw Error(error.message)
      
      toast({
        title: "Success",
        description: "Authentication successful",
      })
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (timer > 0) return
    
    setIsLoading(true)
    try {
      const fullPhoneNumber = countryCode + phoneNumber.replace(/^0+/, '')
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      })
      
      if (error) throw Error(error.message)
      
      toast({
        title: "Code sent",
        description: "New OTP sent",
      })
      
      setTimer(30) // Reset timer
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="perspective-1000 w-full">
      <div className={cn(
        "relative w-full transition-all duration-700 transform-style-preserve-3d",
        isFlipped ? "rotate-y-180" : ""
      )}>
        {/* Phone Number Side */}
        <div className={cn(
          "w-full backface-hidden",
          isFlipped ? "invisible" : "visible"
        )}>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className={cn(
              "space-y-2 transition-all duration-200",
              inputFocused ? "scale-105" : ""
            )}>
              <Label htmlFor="phoneNumber">Phone</Label>
              <div className="flex">
                <Select 
                  value={countryCode}
                  onValueChange={setCountryCode}
                >
                  <SelectTrigger className="w-[110px] mr-2 flex-shrink-0">
                    <SelectValue placeholder="+968" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center">
                          {country.code} ({country.country})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="1234 5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    required
                  />
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !phoneNumber}
            >
              {isLoading ? "Sending..." : "Continue"}
            </Button>
          </form>
        </div>

        {/* OTP Side */}
        <div className={cn(
          "absolute top-0 left-0 w-full backface-hidden rotate-y-180",
          isFlipped ? "visible" : "invisible"
        )}>
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0"
              onClick={() => setIsFlipped(false)}
              disabled={isLoading}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="otp">Verification Code</Label>
                  <span className="text-xs text-muted-foreground">
                    {countryCode + phoneNumber.replace(/^0+/, '')}
                  </span>
                </div>
                <Input
                  id="otp"
                  type="text"
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  className="text-center text-lg tracking-[0.5em]"
                  autoFocus
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>

            <div className="text-center">
              <Button 
                variant="link" 
                className="text-xs"
                onClick={handleResendOtp}
                disabled={timer > 0 || isLoading}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}