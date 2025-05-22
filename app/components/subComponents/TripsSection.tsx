// app/components/TripsSection.tsx
"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import dynamic from "next/dynamic";
import { databases } from "@/lib/appwriteConfig";

const TripMap = dynamic(() => import("./TripMap"), {
    ssr: false,
});

type Trip = {
    id: string;
    title: string;
    activities: string[];
    image: string | null;
}

const TripsSection = () => {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(
        null
    );
    const [coords, setCoords] = useState<[number, number]>([28.6139, 77.209]);
    const [trips, setTrips] = useState<Trip[]>([]); 



    // fetch coordinates when a loction is selected
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

    // Delete trip function | duplicate this to avoid typescript error
    const handleDeleteTrip = async (tripId: string) => {
try {
    await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
        tripId
    );
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId)); // Update state)
} catch (error) {
    console.error("Error deleting trip:", error);
    
}
    }

    return (
        <div className="flex flex-col gap-6">
            <Card
                setSelectedLocation={setSelectedLocation}
                trips={trips}
                onDelete={handleDeleteTrip}
            />
            <TripMap location={coords} />
        </div>
    );
};

export default TripsSection;
