import { IonImg } from "@ionic/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "src/components/shadeAvatar";

export default function  ({ src, ...props })  {
 
  return (
    <Avatar {...props}>
      <AvatarImage src={src}></AvatarImage>
      <AvatarFallback>
        <IonImg
          alt="user avatar"
          src={`https://ui-avatars.com/api/?name=${props?.name!||"user name"}`}
        />
      </AvatarFallback>
    </Avatar>
  );
  
    
};

