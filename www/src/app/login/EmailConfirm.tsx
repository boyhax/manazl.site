import React, { useState, useCallback, useEffect } from 'react'
import { useTranslate } from '@tolgee/react'
import { Loader2, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function EmailConfirmView() {
  const router = useRouter()
  const { t } = useTranslate()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const emailParam = params.get('email')
    if (!emailParam) {
      router.push('/')
    } else {
      setEmail(emailParam)
    }
  }, [])

  const verifyOTP = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) {
      setError(t('OTP must be 6 digits'))
      return
    }
    setIsVerifying(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (error) throw error
      toast({
        title: t('Email confirmed'),
        description: t('Your email has been successfully verified.'),
      })
      router.push('/')
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast({
        title: t('Verification failed'),
        description:  t('An error occurred during verification.'),
        variant: 'destructive',
      })
    } finally {
      setIsVerifying(false)
    }
  }, [email, otp, router, t, toast])

  const resendOTP = useCallback(async () => {
    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        email,
        type: 'signup',
        options: { emailRedirectTo: location.origin },
      })
      if (error) throw error
      toast({
        title: t('OTP Resent'),
        description: t('Please check your email for the new OTP.'),
      })
    } catch (error) {
      console.error('Error resending OTP:', error)
      toast({
        title: t('Resend failed'),
        description: t('An error occurred while resending the OTP.'),
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }, [email, t, toast])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setOtp(value)
    setError('')
  }

  if (!email) return null

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('Verify Your Email')}</CardTitle>
          <CardDescription>{t('Enter the OTP sent to your email')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={verifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">{t('OTP')}</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder={t('Enter 6-digit OTP')}
                value={otp}
                onChange={handleOtpChange}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Verifying')}
                </>
              ) : (
                t('Verify')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={resendOTP} disabled={isResending}>
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Resending')}
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {t('Resend OTP')}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}