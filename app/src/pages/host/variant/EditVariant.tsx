import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "src/components/BackButton";
import Header from "src/components/Header";
import Page from "src/components/Page";
import Toolbar from "src/components/Toolbar";
import useFetch from "src/hooks/useFetch";
import { update_variant } from "src/lib/db/variants";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import VariantForm, { InitialType } from "./variantForm";
import { useState } from "react";

export default function EditVariant() {
  const navigate = useNavigate();
  const [toast] = useIonToast();
  const session = auth((s) => s.session);
  const { id } = useParams();
  const { t } = useTranslate();
  const [isSubmitting, setisSubmitting] = useState(false);
  const { data, error, loading } = useFetch(
    async () =>
      await supabase.from("variants").select("*").eq("id", id).single()
  );
  const variant = data ? data.data : null;
  console.log(variant);
  async function hundledelete() {
    const { error } = await supabase.from("variants").delete().eq("id", id);
    toast(
      error
        ? t("Delete Not Done:Error: ") + error.message
        : t("Variant Deleted"),
      1000
    );
    if (!error) navigate("/account");
  }
  const onSubmit = async (values: InitialType) => {
    setisSubmitting(true)

    try {
      const { error } = await update_variant({
        id,
        ...Object.fromEntries(
          Object.entries(values).filter(([key]) => key !== "short_id")
        ),
      });
      if (error) {
        console.error("Update variant error", error);
        toast(t("Updating failed"), 1000);
      } else {
        toast(t("updated"));
        navigate("/account");
      }
    } catch (error) {
      console.error("Unexpected error", error);
      toast(t("An unexpected error occurred"), 1000);
    }finally{
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

  if (!session || !variant) {
    return null;
  }

  return (
    <Page className="w-full max-w-2xl mx-auto overflow-y-auto scroll-smooth">
      <Header>
        <Toolbar>
          <BackButton to={"/account"} />
        </Toolbar>
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
        <VariantForm
        isSubmitting={isSubmitting}
          initialValues={variant as InitialType}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Page>
  );
}
