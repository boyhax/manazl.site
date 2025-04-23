import {
  IonContent,
  IonProgressBar,
  useIonToast
} from "@ionic/react";
import { useNavigate } from "react-router-dom";

import BackButton from "src/components/BackButton";
import Header from "src/components/Header";
import Page from "src/components/Page";
import Toolbar from "src/components/Toolbar";
import { Listing, update_listing } from "src/lib/db/listings";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import ListingForm, { defaultValues } from "./listingForm";
import { useTranslate } from "@tolgee/react";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadfiles, useImageUpload } from "src/hooks/useImageUpload";
import { useToast } from "src/hooks/use-toast";

// Define Zod schema for form validation
export const listingSchema = z.object({
  title: z.string()
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(100, { message: 'Title must be max 100 characters' }),
  description: z.string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(500, { message: 'Description must be max 500 characters' }),
  meta: z.record(z.any()).optional(),
  amenities: z.array(z.string()).optional().default([]),
  type: z.string({ required_error: 'Type is required' }),
  filesToUpload: z.array(z.any()).optional(),
  imagesToDelete: z.array(z.string()).optional(),
  images: z.array(z.string()),
  lat: z.number({ required_error: 'Latitude is required' }),
  lng: z.number({ required_error: 'Longitude is required' }),
  address: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional().default([]),
});

// Type for the form data derived from the Zod schema
export type ListingFormSchema = z.infer<typeof listingSchema>;

export default function EditListing() {
  const navigate = useNavigate();
  const {toast} = useToast();
  const { t } = useTranslate();
  const user = auth((s) => s.user);


  const Submit = async ({images,filesToUpload,imagesToDelete,...values}: ListingFormSchema) => {
    let newimages = images
    
    if (!!filesToUpload) {
      const newImagesUrls = await uploadfiles(filesToUpload, {
        path: user.id + "/" + 'images'
      })
      console.log({ filesToUpload ,newImagesUrls})
      newimages = [...images,...newImagesUrls]
    }
    if (imagesToDelete) {
      newimages = newimages.filter(url=>!imagesToDelete.includes(url))
    }
    
    return await update_listing({ ...values, images: newimages });
  };
  const { data, error, isLoading,refetch } = useQuery({
    queryKey: ['myhost'],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*").match({ user_id: user.id }).single()
      return data
    }
  })
  const { isPending: isSubmitting, error: submitError, mutate: onSubmit } = useMutation({
    mutationKey: ['hostupdate'],
    mutationFn: Submit,
    onSuccess: () => {
      toast({
        title:t('Update Done ')
      })
      refetch()
    },
    onError: (err) => {
      toast({
        title: t('Update Failed ')
      })
    }
    
  })
  const listing = data as Listing;

  const initialValues = listing || defaultValues;



  if (error) {
    throw new Error(error.message);
  }

  if (isLoading) {
    return <IonProgressBar type={"indeterminate"} />;
  }

  return (
    <Page>
      <Header>
        <Toolbar>
          <BackButton to={"/account"} />

        </Toolbar>
      </Header>
      <IonContent className={""}>
        <ListingForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </IonContent>
    </Page>
  );
}
