import { IonContent, IonImg, IonLabel, IonSpinner } from "@ionic/react";
import React from "react";
import useTheme from "src/hooks/useTheme";
import "./LoadingScreen.css";
interface Props {
  text?: string;
}
const LoadingScreen: React.FC<Props> = ({ text }) => {

  const {isDark} = useTheme()

  return (
    <div className={"w-screen h-screen "}>
      <IonContent fullscreen>
        <div
          className={
            "flex  flex-col gap-6 justify-center items-center w-full h-full "
          }
        >
          <div className={"flex flex-col items-center"}>
            {/* <IonImg className={'animate-pulse '} style={{
              width: "160px",height: "80px"
            }} src={'src/assets/icon-only.png'}/> */}
            <IonLabel
              className={
                "text-4xl  text-bold text-center text-[var(--ion-color-primary)] font-serif drop-shadow-md animate-bounce animate-infinite"
              }
            >
              Manazl <br />
            </IonLabel> 
        
            <IonSpinner name="dots"/>
          </div>
        </div>
      </IonContent>
    </div>
  );
};

export default LoadingScreen;

const CubeAnimated = () => {
  return (
    <div className={"cube w-5 h-5  "}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
