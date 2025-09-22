'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTolgee, useTranslate } from '@tolgee/react'
import { SignOut } from '@/lib/db/auth'
import { updateUser } from '@/lib/db/profile'
import { useUserContext } from '@/providers/userProvider'
import { useCurrency } from '@/hooks/useCurrency'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { MainContent } from '@/components/Page'

import { Globe, Lock, LogOut, MessageSquare, Bell, Share2, HelpCircle, DollarSign } from 'lucide-react'

const defaultNotifications = {
  messages: true,
  bookings: true,
  ads: true,
}

export default function Settings() {
  const { user } = useUserContext()
  const notifications = user
    ? user.user_metadata?.notifications || defaultNotifications
    : defaultNotifications

  const tolgee = useTolgee(['language'])
  const router = useRouter()
  const lang = tolgee.getLanguage()
  const { t } = useTranslate()
  const { currency, setCurrency } = useCurrency()
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const onLanguageChange = (newLang: string) => {
    tolgee.changeLanguage(newLang)
  }

  const updateNotification = (update: Partial<typeof defaultNotifications>) => {
    const newNotifications = { ...notifications, ...update }
    updateUser({ notifications: newNotifications })
  }

  return (
    <MainContent>
      <ScrollArea className="h-full">
        <div className="container mx-auto py-6 space-y-8 max-w-2xl">
          <h1 className="text-3xl font-bold">{t('settings')}</h1>

          <Card>
            <CardHeader>
              <CardTitle>{t('Account')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/changepassword')}>
                <Lock className="mr-2 h-4 w-4" />
                {t('Change Password')}
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={user ? SignOut : () => router.push('/login')}>
                <LogOut className="mr-2 h-4 w-4" />
                {user ? t('LogOut') : t('LogIn')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('General')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <Label>{t('Language')}</Label>
                </div>
                <Select value={lang} onValueChange={onLanguageChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <Label>{t('Currency')}</Label>
                </div>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OMR">{t('Omani Rial')}</SelectItem>
                    <SelectItem value="$">{t('US Dollar')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <Button variant="link" asChild>
                <Link href="/policy">{t('Terms of Service')}</Link>
              </Button>
              <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t('Talk With Us')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('Feedback')}</DialogTitle>
                    <DialogDescription>
                      {t('We value your feedback. Please share your thoughts with us.')}
                    </DialogDescription>
                  </DialogHeader>
                  {/* Add your feedback form here */}
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="mr-2 h-4 w-4" />
                {t('Share The App')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('Notifications')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <Label htmlFor="ads-notifications">{t('Ads & News')}</Label>
                </div>
                <Switch
                  id="ads-notifications"
                  checked={notifications.ads}
                  onCheckedChange={(checked) => updateNotification({ ads: checked })}
                />
              </div>
              {user && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label htmlFor="messages-notifications">{t('Messages')}</Label>
                  </div>
                  <Switch
                    id="messages-notifications"
                    checked={notifications.messages}
                    onCheckedChange={(checked) => updateNotification({ messages: checked })}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              <Link href="https://manazl-web.vercel.app" className="font-medium underline underline-offset-4">
                Manazl
              </Link>
              {' '}v1.0
            </p>
          </CardFooter>
        </div>
      </ScrollArea>
    </MainContent>
  )
}

