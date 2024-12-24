import { useTolgee } from "@tolgee/react";

export const useAppDirection=()=>{
    const {getLanguage} = useTolgee()
    const dir = getLanguage()=="ar"?'rtl':'ltr';
    return dir
  }