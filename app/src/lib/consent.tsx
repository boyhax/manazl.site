import { IonCheckbox, IonContent, IonFooter, IonToolbar } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { FunctionComponent } from "react";
import useDisclosore from "src/hooks/useDisclosore";
import { AppTermsContent } from "src/pages/policyPage";

interface ConsentProps {
  onCheckChange: (cheked: boolean) => void;
  checked: boolean;
}

const Consent: FunctionComponent<ConsentProps> = ({
  checked,
  onCheckChange,
}) => {
  const [isopen, onOpen, onClose] = useDisclosore(false);
  const { t } = useTranslate();

  return (
    <div className={""}>
      <IonContent>
        <AppTermsContent />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonCheckbox
            checked={checked}
            onIonChange={(e) => onCheckChange(e.detail.value)}
            className={"mx-4 my-1 "}
          >
            {" "}
            {t("I agree ")}
          </IonCheckbox>
        </IonToolbar>
      </IonFooter>
    </div>
  );
};

export default Consent;
