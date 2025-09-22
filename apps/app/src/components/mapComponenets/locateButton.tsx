import { IonFab, IonFabButton } from "@ionic/react";
import { LatLng } from "leaflet";
import React, { useEffect, useState } from "react";
import { BiChevronLeft, BiCurrentLocation } from "react-icons/bi";
import { useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router";
import { getPosition } from "src/lib/utils/getPosition";
import { useMediaQuery } from "usehooks-ts";
import MapSearchBar from "../MapSearchBar";

export default function LocateButton(): React.JSX.Element {
  const [available, setavailable] = useState(false);
  const map = useMapEvents({});
  const navigate = useNavigate();
  const [position, setposition] = useState<{ lat: number; lng: number }>(null);
  useEffect(() => {
    position !== null && moveToPosition(position);
  }, [position]);

  const moveToPosition = (pos: { lat: number; lng: number }) => {
    try {
      let to = new LatLng(pos.lat, pos.lng);

      map.flyTo(to, 15);
    } catch (error) {
      console.log(
        "error from move to position on locate button tsx :>> ",
        error
      );
    }
  };
 
  const locate = async () => {
    const location = await getPosition();
    if (location) {
      setposition({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }
    setavailable(!!location);
  };

  return (
    <IonFabButton
      style={{ "--background": "white" }}
      size={"small"}
      onClick={locate}
    >
      <BiCurrentLocation className={"text-xl text-black"} />
    </IonFabButton>
  );
}
