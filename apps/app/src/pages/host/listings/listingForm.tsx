import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { IonSpinner } from "@ionic/react";
import { useTolgee, useTranslate } from "@tolgee/react";
import { TagIcon } from "lucide-react";
import { useState } from "react";
import ListingPlacePicker from "src/components/ListingPlacePicker";
import { Stepper, StepperContent } from "src/components/stepper";
import TagsInput from "src/components/ui/tagsInput";
import { auth } from "src/state/auth";
import ImagePicker from "src/components/ImagePicker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { listingSchema } from "./editListing";
import { propertyCategories } from "src/lib/data/categories";
import { amenities } from "src/lib/data/amenities";

export type ListingFormData = z.infer<typeof listingSchema>;

export const defaultValues: ListingFormData = {
  lat: 23.5,
  lng: 58.5,
  address: { city: "", country: "", state: "" },
  meta: {},
  title: "",
  description: "",
  images: [],
  type: "villa",
  amenities: [],
  tags: [],
};

type ListingFormProps = {
  initialValues?: ListingFormData;
  onSubmit: (data: ListingFormData) => void;
  isSubmitting?: boolean;
};

export default function ListingForm({ initialValues = defaultValues, onSubmit, isSubmitting = false }: ListingFormProps) {
  const user = auth((s) => s.user);
  const [step, setStep] = useState(1);
  const { t } = useTranslate();
  const { getLanguage } = useTolgee()
  const lang = getLanguage() || "en";
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
    trigger,
    watch
  } = useForm<ListingFormData>({
    defaultValues: initialValues,
    resolver: zodResolver(listingSchema),
    mode: 'onChange',
  });

  // Watch for images to handle proper validation
  const watchImages = watch("images");
  const watchFilesToUpload = watch("filesToUpload");

  const onFormSubmit: SubmitHandler<ListingFormData> = (data) => {
    onSubmit(data);
  };

  const handleRemoveOldImage = (imageUrl: string) => {
    // Add to imagesToDelete array
    const currentImagesToDelete = getValues("imagesToDelete") || [];
    setValue("imagesToDelete", [...currentImagesToDelete, imageUrl]);
    
    // Remove from images array
    const currentImages = getValues("images") || [];
    setValue("images", currentImages.filter(img => img !== imageUrl));
  };

  const handleNextStep = async () => {
    // Validate the fields in the current step before proceeding
    const fieldValidationMap = {
      1: ['title', 'description'],
      2: ['images'],
      3: ['type'],
      4: ['amenities'],
      5: ['lat', 'lng', 'place_name'],
      6: ['tags']
    };

    const fieldsToValidate = fieldValidationMap[step] || [];
    const isValid = await trigger(fieldsToValidate as any);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderErrorMessage = (fieldName: keyof ListingFormData) => {
    const errorMessage = errors[fieldName]?.message;
    if (errorMessage) {
      return (
        <p className="text-sm bg-slate-100 text-destructive mt-1">{errorMessage as string}</p>
      );
    }
    return null;
  };

  const steps = [
    {
      title: t("Title and Description"),
      content: (
        <div className="space-y-4 px-2">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              {t("Title")}
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  id="title"
                  {...field}
                  placeholder={t("Enter a catchy title for your listing")}
                  className="mt-1"
                />
              )}
            />
            {renderErrorMessage("title")}
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              {t("Description")}
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  {...field}
                  placeholder={t("Describe your place")}
                  rows={4}
                  className="mt-1"
                />
              )}
            />
            {renderErrorMessage("description")}
          </div>
        </div>
      ),
    },
    {
      title: t("Add Images"),
      content: (
        <div>
          <Label className="text-sm font-medium">{t("Add Images")}</Label>
          <Controller
            name="filesToUpload"
            control={control}
            render={({ field }) => (
              <ImagePicker
                files={field.value || []}
                onFilesChange={(files) => {
                  setValue("filesToUpload", files);
                }}
                oldImagesUrls={getValues("images") || []}
                onRemoveOldImage={handleRemoveOldImage}
              />
            )}
          />
          {(watchImages?.length === 0 && watchFilesToUpload?.length === 0) && (
            <p className="text-sm bg-slate-100 text-destructive mt-1">
              {t("At least one image is required")}
            </p>
          )}
        </div>
      ),
    },
    {
      title: t("Property Category"),
      content: (
        <div>
          <Label className="text-sm font-medium">{t("Property Category")}</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                {propertyCategories.map(({ icon: Icon, label, label_ar, value, slug }) => (
                  <Label
                    key={value}
                    htmlFor={value}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value={value} id={value} className="sr-only" />
                    <Icon className="mb-3 h-6 w-6" />
                    {t(label)}
                  </Label>
                ))}
              </RadioGroup>
            )}
          />
          {renderErrorMessage("type")}
        </div>
      ),
    },
    {
      title: t("Amenities"),
      content: (
        <div className="overflow-y-auto touch-pan-y scroll-smooth">
          <Label className="text-sm font-medium">{t("Amenities")}</Label>
          <Controller
            name="amenities"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {amenities.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={field.value?.includes(item.id)}
                      onCheckedChange={(checked) => {
                        const updatedAmenities = checked
                          ? [...(field.value || []), item.id]
                          : (field.value || []).filter((i) => i !== item.id);
                        setValue("amenities", updatedAmenities);
                      }}
                    />
                    <label
                      htmlFor={item.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t(item.label)}
                    </label>
                  </div>
                ))}
              </div>
            )}
          />
          {renderErrorMessage("amenities")}
        </div>
      ),
    },
    {
      title: t("Location"),
      content: (
        <div>
          <Label htmlFor="location" className="text-sm font-medium">
            {t("Location")}
          </Label>
          <div className="flex items-center space-x-2 mt-1">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <ListingPlacePicker
                  placeholder={Object.values( field.value).join(' ') || t("Pick Location")}
                  onChange={(place) => {
                    if (place) {
                      setValue("lat", place.place_point[0]);
                      setValue("lng", place.place_point[1]);
                      setValue("address", { 
                        country: place.country, 
                        state: place.state, 
                        city: place.city, 
                      });
                    }
                  }}
                  place_point={[getValues("lat"), getValues("lng")]}
                />
              )}
            />
            {renderErrorMessage("address")}
          </div>
        </div>
      ),
    },
    {
      title: t("Tags"),
      content: (
        <div>
          <Label htmlFor="tags" className="text-sm font-medium">
            {t("Tags")}
          </Label>
          <div className="flex items-center space-x-2 mt-1">
            <TagIcon className="h-5 w-5 text-gray-400" />
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagsInput
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  tags={field.value || []}
                  setTags={(tags) => setValue("tags", tags)}
                  className="flex-1"
                />
              )}
            />
          </div>
          
          {/* Error summary display */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 text-destructive text-sm mt-4 bg-slate-100 rounded">
              <h3 className="font-bold mb-2">Please fix the following errors:</h3>
              {Object.entries(errors).map(([key, error]) => (
                <div key={key} className="text-start mb-1">
                  <strong>{key}:</strong> {error.message as string}
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 pb-16 pt-2 max-w-md">
      <div className="flex flex-col grow w-full">
        <div dir={"ltr"} className="">
          <div dir="ltr" className="flex justify-between mt-6 mb-2 ">
            <Button
              onClick={handlePrevStep}
              disabled={step === 1 || isSubmitting}
              variant="outline"
              size="sm"
            >
              {t("Previous")}
            </Button>
            <Button
              onClick={step === steps.length ? handleSubmit(onFormSubmit) : handleNextStep}
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? <IonSpinner className={"mx-1"} /> : null}
              {step === steps.length ? t("Submit") : t("Next")}
            </Button>
          </div>
          <Stepper steps={steps.length} currentStep={step} onChange={setStep} />
        </div>
        <div className="w-full pt-1">
          <StepperContent
            steps={steps}
            currentStep={step}
            onNext={handleNextStep}
            onPrevious={handlePrevStep}
          />
        </div>
      </div>
    </div>
  );
}
