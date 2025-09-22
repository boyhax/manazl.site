import { IonLabel } from "@ionic/react";
import { useNavigate } from "react-router-dom";
import Img from "src/components/Image";
import { useTranslate } from "@tolgee/react";
import { store } from "src/state/Store";



const ExplorePlaces = () => {
  const navigate = useNavigate();
  const {t} = useTranslate()
  const featuredPlaces = store(s=>s.cities)
  return (
    <div className={"flex flex-wrap flex-row overflow-x-auto gap-2"}>
      {featuredPlaces?.map!((place:{name:string,lat:number,lng:number,thumbnail:string}) => {
        return (
          <div
          key={place.name+"place"}
            onClick={() =>
              navigate(`?geo=${place.lat},${place.lng}`)
            }
            className={
              "  items-center h-16 w-24  mt-2 max-w-md overflow-hidden relative rounded-md"
            }
          >
            <Img
              className={"object-cover  overflow-hidden  w-full h-full "}
              src={place.thumbnail}
            />
            <div
              className={
                "absolute  bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent flex items-center justify-start w-full"
              }
            >
              <IonLabel
                className={
                  " inset-4 ms-3  text-2xl font-sans text-white  text-start capitalize truncate "
                }
              >
                {t(place.name)}
              </IonLabel>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExplorePlaces;
