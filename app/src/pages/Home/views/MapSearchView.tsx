import { IonContent } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { DivIcon, LatLngLiteral, Map, latLng } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { MapControls } from "src/components/mapComponenets/mapBasicControl";
import {
  FilterView,
  ListingPreviewProps
} from "src/lib/db/listings";
import MapListingPreview from "../components/mapListingPreviewCard";
import { useQuery } from "@tanstack/react-query";
import supabase from "src/lib/supabase";
import MapMenuControl from "src/components/mapComponenets/mapMenuControl";
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

interface View {
  north: string | number,
  south: string | number,
  west: string | number,
  east: string | number,
}
async function getMapListings(view: View, limit) {
  let {
    north: min_lat,
    south: max_lat,
    west: min_lng,
    east: max_lng,
  } = view;
  let query = supabase.rpc(
    "listings_in_view",
    {
      max_lat,
      max_lng,
      min_lat,
      min_lng,
    },
    { count: "exact" }
  ).select('lat,lng,title,images,id,rating,short_id,reviews(count)').limit(30);
  return await query
}

export default function (props) {
  const [view, setview] = useState<any>();
  const [selected, setselected] = useState<ListingPreviewProps>();
  const point = selected ? latLng(selected.lat, selected.lng) : [23.1, 58.1];
  const mapref = useRef<Map>();
  const flayto = useCallback(
    (point: LatLngLiteral, zoom: number = mapref.current?.getZoom()) => {
      mapref.current?.flyTo(point, zoom);
    },
    [mapref.current]
  );

  const {
    data,
    isError,
    isLoading,

  } = useQuery({
    queryKey: ["maplistings", view],
    queryFn: searchListings,
    staleTime: 500,
    enabled: !!view
  });


  async function searchListings() {
    const { data, error } = await getMapListings(
      view,
      20,
    );
    console.log('data,error :>> ', data, error);
    if (error) throw Error(error.message)
    return data;
  }
  const onMarkerClick = (item) => {
    setselected(item);
  };
  useEffect(() => {
    selected?.lat &&
      selected?.lng &&
      flayto(latLng(selected.lat, selected.lng));
  }, [selected]);




  console.log("selected :>> ", selected);
  return (
    <IonContent>
      <MapContainer
        ref={mapref}
        {...props}
        center={point as [number, number]}
        zoom={13}
        scrollWheelZoom={true}
        placeholder={<MapPlaceholder />}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        whenReady={() => {
          console.log('mapready :>> ', !!mapref.current);
        }}
      >
        <div
          className={
            "rounded-xl shadow-lg  w-full absolute bottom-16  z-[1000]"
          }
        >
          {selected && (
            <MapListingPreview
              key={'popover' + selected.id}
              selected={selected as any}
              onClose={() => {
                setselected(null);
              }}
            />
          )}
        </div>
        <ReactLeafletGoogleLayer useGoogMapsLoader={false} apiKey={import.meta.env.VITE_APP_google_key} />

        {/* <TileLayer
          detectRetina={true}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={Maplayers.streets.light}
        /> */}
        {data ? data.map((item) => {
          if (!item.lat || !item.lng) {
            return null;
          }
          console.log('item :>> ', item);
          return (
            <ListingMarker
              item={item}
              key={item.id}
              onHover={() => { }}
              onclick={() => onMarkerClick(item)}
              type={"default"}
            />
          );
        }) : null}
        <MapSetup />
        <MapListingSearch onViewChange={setview} />
        <MapControls />
        {/* <MapMenuControl horizontal="left" /> */}
      </MapContainer>
    </IonContent>
  );
}

export const Maplayers = {
  satalite: {
    dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    light: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  streets: {
    dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    light: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
};
export const MapSetup = () => {
  const map = useMapEvents({});

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, []);

  return <></>;
};
const MapListingSearch = ({ onViewChange }: { onViewChange }) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.on("moveend", hundlDragEnd);
    map.on("dragend", hundlDragEnd);
    hundlDragEnd()

  }, []);
  function hundlDragEnd() {
    const view = FilterView({
      west: map.getBounds().getWest().toString(),
      south: map.getBounds().getSouth().toString(),
      east: map.getBounds().getEast().toString(),
      north: map.getBounds().getNorth().toString(),
    });
    onViewChange && onViewChange(view)

  }

  return <></>;
};

function MapPlaceholder() {
  const { t } = useTranslate();

  return (
    <p>
      Map.{" "}
      <noscript>{t("You need to enable JavaScript to see this map.")}</noscript>
    </p>
  );
}

const ListingMarker = ({ onclick, onHover, item, type }) => {

  return (
    <Marker
      eventHandlers={{
        click: (event) => {
          onclick(event);
          console.log("marker click");
        },
        keydown: (event) => {
          onclick(event);
        },
      }}
      icon={
        new DivIcon({

          iconSize: [50, 50],
          html: `
                    <div>
                        <img style="width:100%;height:100%;object-fit: cover;
                            aspect-ratio:1"  src=${item.images ? item.images[0] : ""} />
                    </div>
                    `,
          className: ClassName.marker,
        })
      }
      position={latLng(item.lat, item.lng)}
    ></Marker>
  );
};
const ClassName = {
  marker: 'rounded-full object-contain aspect-square flex overflow-hidden first:w-full first:h-full',
  image: " aspect-square w-full h-full",
  container: " object-contain "
}
