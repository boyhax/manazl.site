//Comment component start minimal and maxemize on click 

import React, { useState } from "react";


export default function Comment(props: { text: string }) {
    const [show, setShow] = useState(false)
    return (<>
        <p onClick={() => setShow(!show)} className={`block ${show ? 'text-clip' : 'truncate'}  `}>{props.text}</p>
    </>)
}