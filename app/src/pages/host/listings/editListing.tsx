import {
  IonContent,
  IonProgressBar,
  useIonToast
} from "@ionic/react";
import { useNavigate } from "react-router-dom";

import { FormikContext, useFormik } from "formik";
import BackButton from "src/components/BackButton";
import Header from "src/components/Header";
import Page, { HeaderTitle } from "src/components/Page";
import Toolbar from "src/components/Toolbar";
import useSupabaseQuery from "src/hooks/useSupabaseQuery";
import { Listing, update_listing } from "src/lib/db/listings";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import ListingForm, { ListingformProps, defaultValues } from "./listingForm";
import * as Yup from 'yup'
import { useTranslate } from "@tolgee/react";


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
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const { t } = useTranslate();

  const user = auth((s) => s.user);
  const { data, error, loading } = useSupabaseQuery(
    supabase.from("listings").select("*").match({ user_id: user.id }).single()
  );
  console.log("data,error,loading :>> ", data, error, loading);
  const old = data as Listing;

  const initialValues = old || defaultValues;

  const onSubmit = async (values: ListingformProps) => {
    formik.setSubmitting(true);
    console.log("values :>> ", values);
    const { error } = await update_listing(values);

    if (error) {
      console.log("update listing error :>> ", error);
      toast(" updating failed", 2000);
    } else {
      toast(" Your Place updated", 2000);
      navigate('/account')
    }
    formik.setSubmitting(false);
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });
  if (error) {
    throw new Error(error.message)
  }
  if (loading) {
    return <IonProgressBar type={"indeterminate"} />;
  }

  return (
    <Page>
      <Header>
        <Toolbar>
          <BackButton to={"/account"} />
          <HeaderTitle>   {t("Edit Host Listing")}
          </HeaderTitle>
        </Toolbar>
      </Header>
      <IonContent className={"  "}>
        <FormikContext.Provider value={formik}>
          <ListingForm />
        </FormikContext.Provider>
      </IonContent>
    </Page>
  );
}
