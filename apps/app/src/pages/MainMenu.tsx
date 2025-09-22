import {
  IonContent,
  IonMenu,
  IonLabel,
  IonFabButton,
  IonFab,
  IonMenuToggle,
} from "@ionic/react";
import React, { useState } from "react";
import {
  CiChat1,
  CiChat2,
  CiHome,
  CiSettings,
  CiSquareInfo,
} from "react-icons/ci";

import { BiChevronRight, BiHomeSmile } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useTranslate } from "@tolgee/react";
const listitems = [
  
  {
    href: "/",
    text: "Home",
    icon: <CiHome size={"2rem"} />,
  },
  {
    href: "/chat",
    text: "chat",
    icon: <CiChat2 size={"2rem"} />,
  },
  {
    href: "/Details",
    text: "About Us",
    icon: <CiSquareInfo size={"2rem"} />,
  },
  {
    href: "/contact",
    text: "Talk With Us",
    icon: <CiChat1 size={"2rem"} />,
  },

  {
    href: "/settings",
    text: "Settings",
    icon: <CiSettings style={{ color: "inherit" }} size={"2rem"} />,
  },
];
const MainMenu = (Props: any) => {
  
  const {t} = useTranslate()

  return (
    <IonMenu
      id="mainMenu"
      ref={Props.menuRef}
      contentId="main-content"
      side={"start"}
    >
      <IonContent class="ion-padding flex flex-col  justify-center space-y-5  ">
        <Link to={"/account"}>
          <IonMenuToggle
            className={
              "flex flex-row justify-between my-1 space-x-1 bg-inherit"
            }
          >
            

              <IonLabel>{t("Account")}</IonLabel>
            
            <BiChevronRight />
          </IonMenuToggle>
        </Link>
        
        <div>
          {listitems.map((item) => (
            <Link to={item.href} key={item.text + "menuLink"}>
              <IonMenuToggle
                className={
                  "flex flex-row justify-between my-1 space-x-1 bg-inherit"
                }
              >
                <div className={"flex flex-row space-x-1"}>
                  {item.icon}
                  <IonLabel>{t(item.text)}</IonLabel>
                </div>
                <BiChevronRight />
              </IonMenuToggle>
            </Link>
          ))}
        </div>
      </IonContent>

      <IonFab horizontal={"center"} vertical="bottom">
        <Link to={"/listings/new"}>
          <IonMenuToggle>
            <IonFabButton color="primary">
              <BiHomeSmile size="2rem" />
            </IonFabButton>
          </IonMenuToggle>
        </Link>
      </IonFab>
    </IonMenu>
  );
};
export default MainMenu;
