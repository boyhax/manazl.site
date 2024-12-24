import { IonIcon } from "@ionic/react";
import { locationSharp } from "ionicons/icons";
import React from "react";

export default function CenterMarker() {
  return (
    <div
      className={
        "flex absolute w-full h-full items-center justify-center z-[1000] pointer-events-none"
      }
    >
      <IonIcon

        className={"text-5xl text-blue-900 "}
        icon={locationSharp}
      ></IonIcon>
    </div>
  );
}
