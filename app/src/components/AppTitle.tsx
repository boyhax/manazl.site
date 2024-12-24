import { IonTitle } from "@ionic/react";
import { settings } from "src/lib/settings";
import React, { FunctionComponent } from "react";



const AppTitle = ({...props}) => {
  return <IonTitle className={'capitalize'} {...props}>{settings.app_name}</IonTitle>;
};

export default AppTitle;
