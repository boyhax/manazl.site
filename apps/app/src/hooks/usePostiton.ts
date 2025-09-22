import { useState, useEffect } from "react";
import { getPosition } from "src/lib/utils/getPosition";


 
const uesPosition=()=>{
  const [position, setposition] = useState<[number,number]>(null);

  useEffect(() => {
    const getpos = async () => {
      const {
        coords: { latitude, longitude },
      } = await getPosition();
      setposition(latitude?[latitude, longitude]:null);
    };
    getpos();
  }, []);

  return {position, setposition}
}  
 
export default uesPosition;