import { useMapEvents } from "react-leaflet";
import PlacesAutocomplete from "./googlePlacesAutocomplete";
import { latLng, latLngBounds } from "leaflet";
import { Search } from "lucide-react";

export default function MApSearchBar() {
  const map = useMapEvents({});
  function hundleplace(place: any) {

    console.log(' place.geometry.viewport :>> ', place.geometry.viewport);
    let top = place.geometry.viewport.getNorthEast().lat()
    let right = place.geometry.viewport.getNorthEast().lng()
    let bottom = place.geometry.viewport.getSouthWest().lat()
    let left = place.geometry.viewport.getSouthWest().lng()
    map.flyToBounds(latLngBounds(latLng(bottom, left), latLng(top, right)))

  }
  return (
    <div onClick={e => e.preventDefault()} className={`
      bg-background
    border rounded-full py-2 px-3 flex 
    flex-row gap-2 
    items-centerspace-x-2 w-fit  focus:w-60
    transition-all   `}>
      <Search className="w-5 h-5" />

      <PlacesAutocomplete

        className={"bg-inherit border-none transition-all focus:border-none focus:outline-none ring-0  w-full"}
        placeholder={'Search Places..'}
        options={{ fields: ['geometry'], componentRestrictions: { country: 'om' } }}
        onChange={hundleplace}
      />
    </div>
  );
}
