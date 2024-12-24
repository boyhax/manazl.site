import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslate } from '@tolgee/react'
import { useFormik } from 'formik'
import { Eye, EyeOff, Lock } from 'lucide-react'
import * as Yup from 'yup'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import supabase from '@/lib/supabase'
import { useToast } from 'src/hooks/use-toast'
import Page, { Header, HeaderBackButton, HeaderTitle } from 'src/components/Page'

const validationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
})

interface FormValues {
  password: string
  confirmPassword: string
}

const initialValues: FormValues = {
  password: '',
  confirmPassword: '',
}

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { t } = useTranslate()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (error) throw error

      toast({
        title: t('Password updated'),
        description: t('Your password has been successfully changed.'),
      })
      navigate('/account')
    } catch (error) {
      console.error('Error resetting password:', error)
      toast({
        title: t('Error'),
        description: error.message || t('An error occurred while resetting your password.'),
        variant: 'destructive',
      })
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return (
    <Page className="container max-w-md mx-auto p-4">
      <Header>
        <HeaderBackButton />
        {/* <HeaderTitle>{t("Password Change")}</HeaderTitle> */}
      </Header>
      <Card>
        <CardHeader>
          <CardTitle>{t('Reset Password')}</CardTitle>
          <CardDescription>{t('Enter your new password below')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t('New Password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-destructive">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('Confirm New Password')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-sm text-destructive">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? t('Saving...') : t('Save New Password')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Page>
  )
}