import { IonToolbar } from "@ionic/react";

export default function Toolbar({ children, ...props }) {
  return (
    <IonToolbar dir={"ltr"} {...props}>
      {children}
    </IonToolbar>
  );
}
