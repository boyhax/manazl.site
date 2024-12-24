import { IonButton, IonFab, IonFabButton, IonIcon } from "@ionic/react";

import { useLocation, useNavigate } from "react-router-dom";

import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useAppDirection } from "src/hooks/useAppDirection";
import { chevronBack, chevronBackSharp, chevronForward } from "ionicons/icons";

export default function BackButton({
  fab,
  to,
  icon,
}: {
  fab?;
  to?: any;
  icon?: JSX.Element;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dir = useAppDirection();

  const onClick = () => {
    !!to 
      ? navigate(to)
      : location.key === "default"
        ? navigate('..')
        : navigate(-1);
  };
  if (fab) {
    return (
      <IonFab horizontal="start" vertical="bottom">
        <IonFabButton size={"small"} onClick={onClick}>
          {icon ? (
            icon
          ) : (
            <IonIcon icon={dir === "rtl" ? chevronBack : chevronForward} />
          )}
        </IonFabButton>
      </IonFab>
    );
  }
  return (
    <IonButton onClick={onClick} fill={'clear'}>
      {icon ? icon : <IonIcon icon={chevronBackSharp} />}
    </IonButton>
  );
}
