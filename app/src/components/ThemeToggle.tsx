import { IonButton, IonIcon } from "@ionic/react";
import { sunnySharp, moonSharp } from "ionicons/icons";
import useTheme from "src/hooks/useTheme";

export default function () {
  const { isDark, toggleTheme } = useTheme();

  return (
    <IonButton onClick={toggleTheme}>
      <IonIcon icon={isDark ? sunnySharp : moonSharp} />
    </IonButton>
  );
}
