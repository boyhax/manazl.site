import { IonTitle } from "@ionic/react";



const AppTitle = ({ ...props }) => {
  return <IonTitle
    className={'capitalize'}
    {...props}>{import.meta.env.app_name || "Manazl"}</IonTitle>;
};

export default AppTitle;
