import { latLng } from "leaflet";
import { Marker } from "react-leaflet";

import React from "react";
import { useNavigate } from "react-router-dom";
import { DotIcon } from "src/lib/utils/leafletMapIcons";

interface ListingMarkerProps {
  place_point:[number,number]
  id: string;
  
}
const ListingMarker: React.FC<{ item: ListingMarkerProps }> = ({
  item:{id,place_point},
}: {
  item: ListingMarkerProps;
}) => {
  // const [data, error,loading] = useAsync(
  //   supabase.from("listings").select("*").eq("id", id).single()
  // );
  const navigate = useNavigate()
  const onMarkerClick=(event)=>{
    navigate(`/listing/${id}`)
    console.log('on marker click listing marker')
  }

  
  
  return(
    <Marker  eventHandlers={{
      click:(event)=>{
        onMarkerClick(event)
      },
      mousedown:(event)=>{
        onMarkerClick(event)
      },
      down:(event)=>{
        onMarkerClick(event)
      },
    }}  icon={DotIcon(10)} position={latLng(place_point)} key={id}></Marker>
  )
  
};

export default ListingMarker;
