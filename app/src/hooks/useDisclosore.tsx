import { FunctionComponent, useState } from "react";

const useDisclosore = (def: boolean=false) => {
  const [isOpen, setOpen] = useState(def);
  const onOpen = ()=>setOpen(true);
  const onClose =()=> setOpen(false);
  const res:[boolean,()=>void,()=>void] = [isOpen, onOpen, onClose]
  return  res
};

export default useDisclosore;
