'use client'

import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

export default function MapRevalidate() {
    const map = useMapEvents({});

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 500);
    }, []);

    return <></>;
};