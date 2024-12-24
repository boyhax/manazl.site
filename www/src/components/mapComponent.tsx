'use client'
import { DivIcon, } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { MapControls } from "src/components/mapComponenets/mapControl";
import {
    FilterView,
    ListingPreviewProps
} from "src/lib/db/listings";
import MapListingCard from "../components/mapListingCard";
import { useQuery } from "@tanstack/react-query";
import supabase from "src/lib/supabase";
import "leaflet/dist/leaflet.css";
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import { useTranslate } from "@tolgee/react";
import MapRevalidate from "./mapComponenets/MapRevalidate";


interface View {
    north: string | number,
    south: string | number,
    west: string | number,
    east: string | number,
}

async function getMapListings(view: View, limit: number) {
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
    ).select('lat,lng,title,images,id,rating');
    return await query
}
export default function MapSearchView() {
    const [view, setview] = useState<any>();
    const [selected, setselected] = useState<ListingPreviewProps>();
    const point = [23.1, 58.1];
    const mapref = useRef<any>();
    const flayto = (point, zoom: number = 10) => {
        mapref.current?.flyTo(point, zoom);
    }


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
        if (error) throw Error(error.message)
        return data;
    }
    const onMarkerClick = (item: any) => {
        setselected(item);
        item && flayto({
            lat: Number(item.lat), lng: Number(item.lng)
        });
    };


    return (
        <div className="relative inline-block w-full h-full ">
            <MapContainer
                ref={mapref as any}
                center={point as [number, number]}
                zoom={13}
                scrollWheelZoom={true}
                placeholder={
                    <MapPlaceholder />
                }

                style={{ width: "100%", height: "100%" }}
                zoomControl={false}

            >
                <div
                    className={
                        "rounded-xl shadow-lg  w-full absolute bottom-16  z-[1000]"
                    }
                >
                    {selected && (
                        <MapListingCard
                            selected={selected as any}
                            onClose={() => {
                                setselected(undefined);
                            }}
                        />
                    )}
                </div>
                {/* <ReactLeafletGoogleLayer useGoogMapsLoader={true} apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS} /> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">google.maps</a>'
                    url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                />
                {data ? data.map((item) => {
                    if (!item.lat || !item.lng) {
                        return null;
                    }
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
                <MapRevalidate />
                <MapListingSearch onViewChange={setview} />
                <MapControls />
            </MapContainer>
        </div>
    );
}



const MapListingSearch = ({ onViewChange }: { onViewChange: (view: any) => void }) => {
    const map = useMapEvents({});
    useEffect(() => {
        map.on("moveend", hundlDragEnd);
        map.on("dragend", hundlDragEnd);
        hundlDragEnd()

    }, [map]);

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

const ListingMarker = ({ onclick, onHover, item, type }: any) => {

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
                    <div 
                    
                        
                        >
                        <img style="width:100%;height:100%;object-fit: cover;
                            aspect-ratio:1"  src=${item.images ? item.images[0] : ""} />
                    </div>
                    `,
                    className: ClassName.marker,
                })
            }
            position={{ lat: item.lat, lng: item.lng }}
        >
        </Marker>
    );
};

const ClassName = {
    marker: 'rounded-full object-contain aspect-square flex overflow-hidden first:w-full first:h-full',
    image: " aspect-square w-full h-full",
    container: " object-contain "
}
