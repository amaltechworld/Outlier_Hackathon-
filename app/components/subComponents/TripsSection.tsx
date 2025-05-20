// app/components/TripsSection.tsx
"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("./TripMap"), {
    ssr: false,
});

const TripsSection = () => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(
        null
    );
    const [coords, setCoords] = useState<[number, number]>([28.6139, 77.209]);

    useEffect(() => {
        const fetchCoordinates = async () => {
            if (!selectedLocation) return;

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${selectedLocation}`
            );
            const data = await res.json();

            if (data && data.length > 0) {
                setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            } 
        };

        fetchCoordinates();
    }, [selectedLocation]);

    return (
        <div className="flex flex-col gap-6">
            <Card setSelectedLocation={setSelectedLocation} />
            <TripMap location={coords} />
        </div>
    );
};

export default TripsSection;
