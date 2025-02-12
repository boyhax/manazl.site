'use client'

import { useFormik } from "formik"
import { useTranslate } from "@tolgee/react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { TagIcon } from 'lucide-react'
import ListingPlacePicker from "@/components/ListingPlacePicker"
import TagsInput from "@/components/ui/tagsInput"
import { ListingformProps, validationSchema } from "./listingForm.types"
import { upsertListing } from "./action"
import supabase from "@/lib/supabase"
import UserImageGallary from "@/components/UserImageGallary"
import { useHostAmenities } from "@/lib/services/host_amentites"
import { useHostTypes } from "@/lib/services/host_types"
import { Icon } from '@iconify/react'

export default function ListingForm({ initialValues }) {
  const { toast } = useToast()
  const { t } = useTranslate()
  const { data: amenitites } = useHostAmenities()
  const { data: types } = useHostTypes()
  const { values, setFieldValue, errors, touched, handleSubmit, isSubmitting } = useFormik<ListingformProps>({
    initialValues,
    onSubmit,
    validationSchema,
  })
  console.log('object :>> ', amenitites, types);
  function onSubmit() {
    upsertListing(values)
      .then(() => {
        toast({ title: "Listing created successfully", duration: 2000 })
      })
      .catch((error) => {
        toast({ title: "Failed to create listing", description: error.message, duration: 2000 })
      })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{t("Create Your Listing")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title and Description */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  {t("Title")}
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                  placeholder={t("Enter a catchy title for your listing")}
                  className="mt-1"
                />
                {touched.title && errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  {t("Description")}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  placeholder={t("Describe your place")}
                  rows={6}
                  className="mt-1"
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="text-sm font-medium">{t("Add Images")}</Label>
              <UserImageGallary
                onChange={(v) =>
                  setFieldValue(
                    "images",
                    v.map((path) => supabase.storage.from("images").getPublicUrl(path).data.publicUrl)
                  )
                }
                path={"userid/listing"}
              />
              {touched.images && errors.images && <p className="text-sm text-destructive mt-1">{errors?.images as string}</p>}
            </div>

            {/* Host Type */}
            <div>
              <Label className="text-sm font-medium">{t("Host Type")}</Label>
              <RadioGroup
                value={values.type}
                onValueChange={(value) => setFieldValue("type", value)}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                {!types ? null : types.map(({ icon, label: value, label_ar }) => (
                  <Label
                    key={value}
                    htmlFor={value}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value={value} id={value} className="sr-only" />
                    <Icon className="mb-3 h-6 w-6" icon={icon} />
                    {value + " " + label_ar}
                  </Label>
                ))}
              </RadioGroup>
              {touched.type && errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">{t("Amenities")}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {!amenitites ? null : amenitites.map(({ icon, label: value, label_ar }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={value}
                      checked={values.amenities.includes(value)}
                      onCheckedChange={(checked) => {
                        const updatedAmenities = checked
                          ? [...values.amenities, value]
                          : values.amenities.filter((i) => i !== value)
                        setFieldValue("amenities", updatedAmenities)
                      }}
                    />
                    <label
                      htmlFor={value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <Icon className="mb-3 h-6 w-6" icon={icon} />

                      {value + " " + label_ar}

                    </label>
                  </div>
                ))}
              </div>
              {touched.amenities && errors.amenities && (
                <p className="text-sm text-destructive mt-1">{errors.amenities}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                {t("Location")}
              </Label>
              <div className="mt-1">
                <ListingPlacePicker
                  placeholder={(values.address.country + " " + values.address.city) || t("Pick Location")}
                  onChange={(place: any) => {
                    if (place) {
                      setFieldValue("lat", place.place_point[0])
                      setFieldValue("lng", place.place_point[1])
                      setFieldValue("address", { country: place.country, state: place.state, city: place.city })
                    }
                  }}
                  place_point={[values.lat, values.lng]}
                />
                {touched.address && errors.address && (
                  <p className="text-sm text-destructive mt-1">{errors.address as string}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags" className="text-sm font-medium">
                {t("Tags")}
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <TagIcon className="h-5 w-5 text-gray-400" />
                <TagsInput
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  tags={values.tags}
                  setTags={(tags: any) => {
                    setFieldValue("tags", tags)
                  }}
                  className="flex-1"
                />
              </div>
              {touched.tags && errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("Submitting...") : t("Create Listing")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

