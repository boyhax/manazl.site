
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import BackButton from "src/components/BackButton";
import Header from "src/components/Header";
import Page from "src/components/Page";
import Toolbar from "src/components/Toolbar";
import { useToast } from "src/hooks/use-toast";
import { create_variant, NewVariant } from "src/lib/db/variants";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import VariantForm, { InitialType } from "./variantForm";
import { useState } from "react";

const initialValues: InitialType = {
  guests: 2,
  beds: 1,
  rooms: 1,
  title: "",
  description: "",
  thumbnail: "",
};

export default function () {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = auth((s) => s.user);
  const [isSubmitting, setisSubmitting] = useState(false);
  const { t } = useTranslate();
  



  const onSubmit = async (values) => {
    if(!user) return;
    setisSubmitting(true)
    try {

      const listingquery = await supabase.from("listings").select("id").eq("user_id", user.id).single();
      if(listingquery.error) throw listingquery.error;
      const listing = listingquery.data;
      const newVariant: NewVariant = {
        listing_id: listing.id,
        ...values,
      };
      console.log("newVariant :>> ", newVariant);
      const { data, error } = await create_variant(newVariant);
      if (error) {
        toast({
          title: t("Sorry, some problems occurred"),
          variant: "destructive",
        });
        console.error(error);
      } else {
        console.log("New variant created:", data);
        toast({ title: t("New variant created") });
        navigate("/account");
      }
    } catch (error) {
      toast({
        title: t("Sorry, some problems occurred"),
        variant: "destructive",
      });
      console.error("Error creating new variant:", error);
    }finally{
      setisSubmitting(false)
    }
  };



  if (!user) return null;

  return (
    <Page className="w-full max-w-2xl mx-auto overflow-y-auto scroll-smooth">
      <Header>
        <Toolbar>
          <BackButton to={"/account"} />
        </Toolbar>
      </Header>
      <CardHeader>
        <CardTitle>{t("Create New Variant")}</CardTitle>
      </CardHeader>
      <CardContent>
        <VariantForm isSubmitting={isSubmitting} initialValues={initialValues} onSubmit={onSubmit} />
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => navigate(-1)}
        >
          {t("Cancel")}
        </Button>
      </CardContent>
    </Page>
  );
}
