import {
  IonHeader,
  IonAvatar,
  IonImg,
  IonMenuToggle,
  useIonRouter,
  IonText,
  IonRow,
  IonToolbar,
  IonIcon,
  IonLabel,
  IonButtons,
  IonButton,
} from "@ionic/react";
import React from "react";
import { CiUser } from "react-icons/ci";

import { auth} from "src/state/auth";
import Avatar from "./Avatar";
import { personOutline } from "ionicons/icons";
import ProfileAvatar from "./ProfileAvatar";
import { BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const AccountHeader = (Props: any) => {
  const navigate= useNavigate();
  const profile = auth((s) => s.profile);
  if(!profile){
    return (<div
      onClick={() => navigate("/account")}
      className="p-2 space-x-2 flex items-center justify-center  "
    >
      <div
        className={"flex flex-row w-full items-center py-2 gap-2 border-b-1 border-solid"}
      >
        <IonAvatar>
          <BiUser size={'3rem'} />
        </IonAvatar>
        <IonText className={"font-extrabold capitalize text-slate-800"}>
          
        </IonText>
      </div>
    </div>)
  }
  return (
      <div
        onClick={() => navigate("/account")}
        className="p-2 space-x-2 flex items-center justify-center  "
      >
        <div
          className={"flex flex-row w-full items-center py-2 gap-2 border-b-1 border-solid"}
        >
          <ProfileAvatar/>
          <IonText className={"font-extrabold capitalize text-slate-800"}>
            {profile
              ? profile.full_name!
                ? profile.full_name!
                : "Enter User Name"
              : "Login"}
          </IonText>
        </div>
      </div>
  );
};
export default AccountHeader;
