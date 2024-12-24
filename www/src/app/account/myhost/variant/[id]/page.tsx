'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@tolgee/react";
import { Loader2 } from "lucide-react";
import Page, { Header, HeaderBackButton } from "src/components/Page";
import { update_variant } from "src/lib/db/variants";
import supabase from "src/lib/supabase";
import VariantForm, { InitialType } from "../../components/variantForm";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import useSupabaseQuery from "@/hooks/useSupabaseQuery";
import { useUserContext } from "@/providers/userProvider";
import LoadingSpinnerComponent from "react-spinners-components";

export default function EditVariant() {
  const navigate = useRouter();
  const { toast } = useToast();
  const { user } = useUserContext();
  const { id } = useParams();
  const { t } = useTranslate();
  const [isSubmitting, setisSubmitting] = useState(false);
  const { data: variant, error, loading } = useSupabaseQuery(
    supabase.from("variants").select("*").eq("id", id).single(), ['variant', id]
  );

  async function hundledelete() {
    const { error } = await supabase.from("variants").delete().eq("id", id);
    toast({
      title: error
        ? t("Delete Not Done:Error: ") + error.message
        : t("Variant Deleted"),
      duration: 1000
    }
    );
    if (!error) navigate.back();
  }
  const onSubmit = async (values: InitialType) => {
    setisSubmitting(true)
    if (!id) return
    try {

      const { error } = await update_variant({
        id: id as string,
        ...Object.fromEntries(
          Object.entries(values).filter(([key]) => key !== "short_id")
        ),
      });
      if (error) {
        console.error("Update variant error", error);
        toast({ title: t("Updating failed"), duration: 1000 });
      } else {
        toast({ title: t("updated") });
        navigate.push("/account");
      }
    } catch (error) {
      console.error("Unexpected error", error);
      toast({ title: t("An unexpected error occurred"), duration: 1000 });
    } finally {
      setisSubmitting(false)
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }



  return (
    <div className="w-full  overflow-y-auto scroll-smooth">
      <Header>
        <HeaderBackButton />
      </Header>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t("Edit Variant")}</CardTitle>
          <Button onClick={hundledelete} variant={"secondary"}>
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!!variant && <VariantForm
          isSubmitting={isSubmitting}
          initialValues={variant as InitialType}
          onSubmit={onSubmit}
        />}
        {loading && <LoadingSpinnerComponent type="Infinity" />}
      </CardContent>
    </div>
  );
}
