import React from 'react'
import { useTranslate } from "@tolgee/react"
import { useFormik } from "formik"
import { InferType, object, string, number, array, boolean } from "yup"
import { BedDouble, BedSingle, Users, Home } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { IonSpinner } from '@ionic/react'

const validationSchema = object({
  title: string().required().max(100),
  description: string().max(500),
  thumbnail: string(),
  active: boolean().default(true),
  guests: number().min(1).default(2),
  beds: number().min(1).default(1),
  rooms: number().min(1).default(1),
  type: string().default('double').oneOf(['single', 'double', 'twin_beds', 'suite'])
})

export type InitialType = InferType<typeof validationSchema>

interface VariantFormProps {
  initialValues: InitialType
  onSubmit: (values: InitialType) => void,
  isSubmitting
}

export default function VariantForm({
  initialValues,
  onSubmit,
  isSubmitting
}: VariantFormProps) {
  const { t } = useTranslate()
  const { toast } = useToast()

  const { errors, values, setFieldValue, handleChange, handleSubmit, ...formik } = useFormik({
    initialValues,
    onSubmit,
    validateOnChange: true,
    validationSchema,
  })



  const roomTypes = [
    { value: 'single', label: t('Single'), icon: BedSingle },
    { value: 'double', label: t('Double'), icon: BedDouble },
    { value: 'twin_beds', label: t('Twin Beds'), icon: BedDouble },
    { value: 'suite', label: t('Suite'), icon: Home },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("Variant Details")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="state" className="text-base font-semibold">
              {t("Published")}
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="state"
                name="State"
                checked={values.active}
                onCheckedChange={(value) => setFieldValue("active", value)}
              />
              <Label htmlFor="state" className="text-sm text-muted-foreground">
                {values.active ? t("Active") : t("Not Active")}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">{t("Title")}</Label>
            <Input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              maxLength={50}
              placeholder={t("Write Title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="description">{t("Description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              maxLength={500}
              placeholder={t("Write description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="type">{t("Room Type")}</Label>
            <Select
              value={values.type}
              onValueChange={(value) => setFieldValue("type", value)}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder={t("Select room type")} />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <type.icon className="mr-2 h-4 w-4" />
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests">{t("Guests")}</Label>
              <Select
                value={values.guests.toString()}
                onValueChange={(value) =>
                  setFieldValue("guests", parseInt(value))
                }
              >
                <SelectTrigger id="guests">
                  <SelectValue placeholder={t("Select guests")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{num}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beds">{t("Beds")}</Label>
              <Select
                value={values.beds.toString()}
                onValueChange={(value) =>
                  setFieldValue("beds", parseInt(value))
                }
              >
                <SelectTrigger id="beds">
                  <SelectValue placeholder={t("Select beds")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center">
                        <BedDouble className="mr-2 h-4 w-4" />
                        <span>{num}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooms">{t("Rooms")}</Label>
              <Select
                value={values.rooms.toString()}
                onValueChange={(value) =>
                  setFieldValue("rooms", parseInt(value))
                }
              >
                <SelectTrigger id="rooms">
                  <SelectValue placeholder={t("Select rooms")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>{num}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? <IonSpinner /> : null}
            {t("Save")}

          </Button>
        </form>
      </CardContent>
    </Card>
  )
}