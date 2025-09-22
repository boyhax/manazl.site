import React, { useEffect, useRef } from "react";

import {
  MapContainer,
  useMapEvents,
  TileLayer, useMap
} from "react-leaflet";
import CenterMarker from "./mapComponenets/CenterMarker";
import useDisclosore from "src/hooks/useDisclosore";
import { fromLatLng } from "react-geocode";
import { Map, latLng } from "leaflet";
import { googleapi } from "src/App";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

interface Place {
  place_point: [number, number];
  place_name: string;
  country?: string;
  city?: string;
}
const SearchLocation = (props) => {
  // Get access to leaflet map
  const { provider } = props;

  // Get search control
  const searchControl = GeoSearchControl({
    provider: provider,
    style: 'bar',
  });

  //   Access Leaflet Map
  const map = useMap();

  useEffect(() => {
    // Add searchControl to Leaflet map
    map.addControl(searchControl);
    return () => { map.removeControl(searchControl); }
  });

  return null; // Do not render any thing
}
export default function PlacePicker(props: {
  onChange?: (place: Place) => void;
  clearButton?: boolean;
  place_point?: [number, number] | null;
  placeholder: string;
  children?: any;
}) {
  const [isOpen, onOpen, onClose] = useDisclosore();
  const point = latLng(props.place_point || [23, 58]);
  const map = useRef<Map>();
  map?.current?.invalidateSize();
  const onPlaceChange = (place: Place) => {
    console.log("on place change  :>> ", place);
    props.onChange(place);
  };
  return (

    <Dialog >
      <DialogTrigger>
        {props.children}
      </DialogTrigger>
      <DialogContent className=" h-[70vh] w-full ">
        <MapContainer
          center={point}
          zoom={13}
          placeholder={<MapPlaceholder />}
          className={"  w-full h-full my-6 mx-2 rounded-sm"}
          zoomControl={false}
        >
          <TileLayer
            attribution=""
            url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
          />
          {/* <MapControlContainer onClick={e => e.stopPropagation()}>
              <MapSearchBar />
            </MapControlContainer> */}
          <SearchLocation provider={new OpenStreetMapProvider({
            params: {
              countrycodes: 'om', // limit search results to the Netherlands
              addressdetails: 1, // include additional address detail parts
            },
          })} />

          <MapRevalidate />
          <CenterMarker />
          <LocationFinder onChange={onPlaceChange} />
        </MapContainer>
      </DialogContent>


    </Dialog>

  );
}
export const MapRevalidate = () => {
  const map = useMapEvents({
    load: () => {
      map.invalidateSize();
    },
  });
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, []);

  return <div></div>;
};

const LocationFinder: React.FunctionComponent<{
  onChange?: (Place) => void;
}> = ({ onChange }) => {
  const map = useMapEvents({
    dragend(e) {
      let { lat, lng } = map.getCenter();
      googleapi.importLibrary("geocoding").then((geocoding) => {
        let service = new geocoding.Geocoder();
        service.geocode(
          {
            location: { lat, lng },
            language: "en-US",

            componentRestrictions: {},
          },
          (result) => {
            var user_city = result[0].address_components.filter(
              (ac) => ~ac.types.indexOf("locality")
            )[0].long_name;

            console.log("google api geocoding result :>> ", user_city, result);
          }
        );
      });
      fromLatLng(lat, lng)
        .then(({ results }) => {
          // const { lat, lng } = results[0].geometry.location;
          // const city = results[0].components[0].short_name;
          // const country = results[0].components[1].short_name;
          console.log(results && results[0]);
          let place: Place = {
            place_point: [
              results[0].geometry.location.lat,
              results[0].geometry.location.lng,
            ],
            place_name:
              results[0].address_components[1].short_name +
              " " +
              results[0].address_components[2].short_name,
          };
          results && onChange(place);
        })
        .catch(console.error);
    },
  });

  map.invalidateSize();

  return <></>;
};

export function MapPlaceholder() {
  return (
    <p>
      Map of London.{" "}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}
export function PreviewMap({ point }) {

  return (<MapContainer

    center={point}
    zoom={13}
    placeholder={<MapPlaceholder />}
    className={"min-h-[5rem]   w-full h-full"}
    zoomControl={false}
    touchZoom={false}
    scrollWheelZoom={false}
  >
    <TileLayer
      attribution=""
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <MapRevalidate />
  </MapContainer>)
} 