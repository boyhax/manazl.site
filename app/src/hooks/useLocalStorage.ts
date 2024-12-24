import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, def: T) {
  function set(value: typeof def) {
    var v=JSON.stringify(def);
    localStorage.setItem(key, v);
    setValue(value);
    
  }
  const get=()=>{
    var v=JSON.parse(localStorage.getItem(key));
    return v||def;
  }
  const [value, setValue] = useState<typeof def>(get());
  
    

  return [value, set] as [typeof def,(value:typeof def)=>void];
}
