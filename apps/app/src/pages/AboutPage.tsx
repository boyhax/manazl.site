import React from "react";
import {
  IonContent,
  IonList,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import Page, { MainContent } from "../components/Page";
import { useTranslate } from "@tolgee/react";

export default function AboutPage  () {
  const {t} = useTranslate()

  return (
    <Page>
      <div className={"h-12"} />
      <MainContent>
        <IonList className={"divide-y-4"}>
          <IonCardTitle className={"m-5"}>
            {t(`shofly tawseel welcomes you`)}{" "}
          </IonCardTitle>

          <div>
            <IonCardTitle>{t(`decsription of shofly tawseel`)}</IonCardTitle>
            <IonCardContent>
              {t(
                `shofly tawseel is person to person delivery app that
                 helps you to deliver your goods from one place to 
                 another anytime someone is available to deliver it`
              )}
            </IonCardContent>
          </div>
          <div>
            <IonCardTitle>{t(`for user`)}</IonCardTitle>
            <IonCardContent>
              {t(
                `it is very easy , just create an account and add your orders 
                choose the delivery time and location and wait for the 
                driver to see your order and contact you.if no one is available
                 you can choose to wait for the next available driver or cancel
                  your order`
              )}
            </IonCardContent>
          </div>
          <div>
            <IonCardTitle>{t(`for Driver`)}</IonCardTitle>
            <IonCardContent>
              {t(
                `after sign in as user ,from account page just do application
                 to be driver then wait until you are approved you need to
                  fill the form with valid and correct informations. after
                   you are approved start look up for orders in your area 
                   and contact the user to deliver
                 the order to the destination, you can see and choose the
                  orders
                 from map 
                 `
              )}
            </IonCardContent>
          </div>
        </IonList>
      </MainContent>
    </Page>
  );
};

