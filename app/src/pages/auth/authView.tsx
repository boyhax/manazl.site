
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IonContent, useIonToast } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import PhoneAuth from "./PhoneAuth";

export default function () {
  const [toast] = useIonToast();
  const { t } = useTranslate();

  return (
    <IonContent>
      <Card className="w-[350px] shadow-none border-none sm:border bg-background mx-auto">
        
        <CardContent className="pt-28">
          <PhoneAuth />
        </CardContent>
        <CardFooter className="flex justify-center mt-28">
          <p className="text-sm text-muted-foreground text-center">
            {t("Subject to the Privacy Policy and Terms of Service.")}
          </p>
        </CardFooter>
      </Card>
    </IonContent>
  );
}
