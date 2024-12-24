"use client";

import { IonContent, useIonLoading, useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { FormikContext, useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, HeaderBackButton, HeaderTitle } from "src/components/Page";
import Page from "src/components/Page";
import { NewListing, create_listing } from "src/lib/db/listings";
import ListingForm, { ListingformProps, defaultValues } from "./listingForm";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(10, 'Title must be at least 10 characters').max(100, 'Title must be max 500 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description must be max 500 characters'),
  meta: Yup.object(),
  amenities: Yup.array().of(Yup.string()),
  type: Yup.string().required('Type is required'),
  images: Yup.array().of(Yup.string()).min(1, 'At least one image is required'),
  lat: Yup.number().required('Latitude is required'),
  lng: Yup.number().required('Longitude is required'),
  place_name: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});


export default function () {
  const [step, setStep] = useState(1);
  const [startloading, stoploading] = useIonLoading();
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const { t } = useTranslate();


  const onSubmit = async (values: ListingformProps) => {
    // startloading({ message: t("Creating.."), showBackdrop: true });
    formik.setSubmitting(true)
    const data: NewListing = {
      thumbnail: "",
      title: values.title,
      address: values.address,
      description: values.description,
      meta: values.meta,
      amenities: values.amenities ?? [],
      type: values.type,
      images: values.images as string[],
      lat: values.lat,
      lng: values.lng,
      tags: values.tags ?? [],
    };

    try {
      const { error, data: newlisting } = await create_listing(data);

      console.log("error, data: newlisting :>> ", error, newlisting, data);
      if (!error) {
        toast(t("New Host Created"), 2000);
        navigate("/account");
      } else {
        toast(t("Some error happen! Sorry"), 2000);
      }
      console.log("error,data from new listing submit :>> ", error, data);
    } catch (error) {
      console.log("error from new listing submit :>> ", error);
    }

    formik.setSubmitting(false)
  };
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    onSubmit,
    validateOnChange: true,
  });
  return (
    <Page>
      <Header>

        <HeaderBackButton />
        <HeaderTitle>
          {t("Create New Host Listing")}
        </HeaderTitle>
      </Header>
      <IonContent className={"  "}>
        <FormikContext.Provider value={formik}>
          <ListingForm />
        </FormikContext.Provider>
      </IonContent>

    </Page>
  );
}
