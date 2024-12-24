import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { IonSpinner } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useFormikContext } from "formik";
import {
  BedDoubleIcon,
  BuildingIcon, HomeIcon,
  TagIcon,
  TentIcon
} from "lucide-react";
import { useState } from "react";
import ListingPlacePicker from "src/components/ListingPlacePicker";
import UserImageGallary from "src/components/UserImageGallary";
import { Stepper, StepperContent } from "src/components/stepper";
import TagsInput from "src/components/ui/tagsInput";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";

export const hostTypes = [
  { icon: HomeIcon, label: "Suite", value: "suite" },
  { icon: BuildingIcon, label: "Villa", value: "villa" },
  { icon: BedDoubleIcon, label: "Room", value: "room" },
  { icon: TentIcon, label: "Camp", value: "camp" },
];

export const amenities = [
  "Wi-Fi",
  "TV",
  "Kitchen",
  "Washer",
  "Free parking",
  "Paid parking",
  "Air conditioning",
  "Dedicated workspace",
  "Pool",
  "Hot tub",
  "Patio",
  "BBQ grill",
  "Outdoor dining area",
  "Fire pit",
  "Gym",
  "Beach access",
  "Ski-in/Ski-out",
  "Smoke alarm",
  "First aid kit",
];
export type ListingformProps = {
  title: string;
  description: string;
  images: any[];
  address: { city, state, country },
  lat: number;
  lng: number;
  type: string;
  meta?;
  place_name?: '',
  amenities: string[];
  tags: string[];
};
export const defaultValues: ListingformProps = {
  lat: 23.5,
  lng: 58.5,
  address: { city: "", country: "", state: "" },
  meta: {},
  title: "",
  place_name: "",
  description: "",
  images: [],
  type: "villa",
  amenities: [],
  tags: [],
};
export default function ({ }) {
  const user = auth((s) => s.user);
  const [step, setStep] = useState(1);
  const { values, setFieldValue, errors, touched, ...form } =
    useFormikContext<ListingformProps>();
  const { t } = useTranslate();
  const updateForm = (key, value) => {
    setFieldValue(key, value);
  };

  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 7));
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const renderErrorMessage = (fieldName: string) => {
    if (errors[fieldName]) {
      return (
        <p className="text-sm bg-slate-100 text-destructive mt-1">{errors[fieldName]}</p>
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
            <Input
              id="title"
              value={values.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder={t("Enter a catchy title for your listing")}
              className="mt-1"
            />
            {renderErrorMessage("title")}
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              {t("Description")}
            </Label>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder={t("Describe your place")}
              rows={4}
              className="mt-1"
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
          <UserImageGallary
            onChange={(v) =>
              setFieldValue(
                "images",
                v.map(
                  (path) =>
                    supabase.storage.from("images").getPublicUrl(path).data
                      .publicUrl
                )
              )
            }
            path={user.id + "/listing"}
          />
          {renderErrorMessage("images")}
        </div>
      ),
    },
    {
      title: t("Host Type"),
      content: (
        <div>
          <Label className="text-sm font-medium">{t("Host Type")}</Label>
          <RadioGroup
            value={values.type}
            onValueChange={(value) => updateForm("type", value)}
            className="grid grid-cols-2 gap-4 mt-2"
          >
            {hostTypes.map(({ icon: Icon, label, value }) => (
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
        </div>
      ),
    },

    {
      title: t("Amenities"),
      content: (
        <div className="overflow-y-auto touch-pan-y scroll-smooth">
          <Label className="text-sm font-medium">{t("Amenities")}</Label>
          <div className="grid grid-cols-2 gap-2 mt-2 ">
            {amenities.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={values.amenities.includes(item)}
                  onCheckedChange={(checked) => {
                    const updatedAmenities = checked
                      ? [...values.amenities, item]
                      : values.amenities.filter((i) => i !== item);
                    updateForm("amenities", updatedAmenities);
                  }}
                />
                <label
                  htmlFor={item}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t(item)}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: t("Location"),
      content: (
        <div>
          <Label htmlFor="tags" className="text-sm font-medium">
            {t("Location")}
          </Label>
          <div className="flex items-center space-x-2 mt-1">
            <ListingPlacePicker
              placeholder={values.place_name || t("Pick Location")}
              onChange={(place) => {
                if (place) {
                  setFieldValue("place_name", place.place_name);
                  setFieldValue("lat", place.place_point[0]);
                  setFieldValue("lng", place.place_point[1]);
                  setFieldValue("address", { country: place.country, state: place.state, city: place.city, });
                } else {
                }
              }}
              place_point={
                [values.lat, values.lng]
              }
            ></ListingPlacePicker>
            {renderErrorMessage("place_name")}
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
            <TagsInput
              id="tags"
              placeholder="Enter tags separated by commas"
              tags={values.tags}
              setTags={(tags) => {
                updateForm("tags", tags);
              }}
              className="flex-1"
            />
          </div>
          <div className="p-4 text-destructive text-sm ">
            {Object.entries(errors).map((error) => {
              console.log('error :>> ', error);
              return (
                <div className="text-start ">
                  <strong>{error[0]}</strong>
                  <p>{error[1] as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 pb-16 pt-2 max-w-md">
      <div className="flex flex-col  grow w-full">
        <div dir={"ltr"} className="">
          <div dir="ltr" className="flex justify-between mt-6 mb-2 ">
            <Button
              onClick={handlePrevStep}
              disabled={step == 1 || form.isSubmitting}
              variant="outline"
              size="sm"
            >
              {t("Previous")}
            </Button>
            <Button
              onClick={step == steps.length ? form.submitForm : handleNextStep}
              size="sm"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? <IonSpinner className={"mx-1"} /> : null}
              {step == steps.length ? t("Submit") : t("Next")}
            </Button>
          </div>
          <Stepper steps={steps.length} currentStep={step} onChange={setStep} />
        </div>
        <div className="w-full pt-4">
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
