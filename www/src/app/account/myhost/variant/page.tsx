'use client'
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@tolgee/react";

import { MainContent } from "src/components/Page";
import { useToast } from "src/hooks/use-toast";
import { create_variant, NewVariant } from "src/lib/db/variants";
import supabase from "src/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VariantForm, { InitialType } from "../components/variantForm";
import { createClient } from "@/app/lib/supabase/client";

const initialValues: InitialType = {
  active: true,
  type: '',
  guests: 2,
  beds: 1,
  rooms: 1,
  title: "",
  description: "",
  thumbnail: "",
};

export default function NewVariantPage() {
  const navigate = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setisSubmitting] = useState(false);
  const { t } = useTranslate();




  const onSubmit = async (values: any) => {
    setisSubmitting(true)
    try {
      const client = createClient()
      const { data: { user } } = await client.auth.getUser()
      if (!user) throw Error('user sign in required')
      const listingquery = await supabase.from("listings").select("id").eq("user_id", user.id).single();
      if (listingquery.error) throw Error('user listing not Found');

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
        navigate.back();
      }
    } catch (error) {
      toast({
        title: t("Sorry, some problems occurred"),
        variant: "destructive",
      });
      console.error("Error creating new variant:", error);
    } finally {
      setisSubmitting(false)
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto overflow-y-auto scroll-smooth">
      <CardHeader>
        <CardTitle>{t("Create New Variant")}</CardTitle>
      </CardHeader>
      <CardContent>
        <VariantForm isSubmitting={isSubmitting} initialValues={initialValues} onSubmit={onSubmit} />
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => navigate.back()}
        >
          {t("Cancel")}
        </Button>
      </CardContent>
    </div>
  );
}
