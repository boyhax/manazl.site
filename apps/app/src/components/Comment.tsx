//Comment component start minimal and maxemize on click 

import { IonText } from "@ionic/react";
import React, { useState } from "react";


export default function Comment(props:{text:string}){
    const [show,setShow] = useState(false)
    return(<>
        <IonText onClick={()=>setShow(!show)} className={`block ${show?'text-clip':'truncate'}  `}>{props.text}</IonText>
    </>)
}