import { IonHeader } from "@ionic/react";
import { cn } from "src/lib/utils/cn";

export default function Header({ children, ...props }) {
  return (
    <IonHeader  {...props} className={cn([" ion-no-border", props.className])}>
      {children}
    </IonHeader>
  );
}
