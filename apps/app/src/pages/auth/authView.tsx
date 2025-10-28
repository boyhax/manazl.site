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
    <IonContent className="flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-xl border border-gray-100 bg-white">
        <CardContent className="py-10 px-6 sm:px-10">
          <PhoneAuth />
        </CardContent>
        <CardFooter className="flex justify-center mt-2 pb-6">
          <p className="text-xs text-muted-foreground text-center">
            {t("Subject to the Privacy Policy and Terms of Service.")}
          </p>
        </CardFooter>
      </Card>
    </IonContent>
  );
}
