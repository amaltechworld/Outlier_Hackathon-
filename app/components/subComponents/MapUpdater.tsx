"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
    coords: [number, number];
};

const MapUpdater = ({ coords }: Props) => {
    const map = useMap();

    useEffect(() => {
        map.setView(coords, 13, {
            animate: true,
        });
    }, [coords, map]);

    return null;
};

export default MapUpdater;
