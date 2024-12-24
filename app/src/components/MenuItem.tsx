import { IonMenuToggle } from "@ionic/react";
import React from "react";


const MenuItem = ({ children, ...props }) => {
  return (
    <IonMenuToggle
      style={props?.style}
      className={
        `${props.className} flex flex-row dark:  rounded-lg shadow-lg mx-2 my-1 px-2 py-2 justify-between items-center active:shadow-xl active:var(--ion-color-medium)` }
      {...props}
    >
      {[children]}
    </IonMenuToggle>
  );
};

export default MenuItem;
