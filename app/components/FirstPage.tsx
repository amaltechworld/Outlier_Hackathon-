"use client";

import { useState, useEffect } from "react";
import Calender from "./subComponents/Calender";
import dynamic from "next/dynamic";
import TripCradForm from "./subComponents/TripCradForm";
import Card from "./subComponents/Card";
import { Query } from "appwrite";
import { databases } from "@/lib/appwriteConfig";

const TripMap = dynamic(() => import("./subComponents/TripMap"), {
    ssr: false,
});

type Trip = {
    id: string;
    title: string;
    activities: string[];
    image: string | null;
    isSaved: boolean;
    date: string;
};

const FirstPage = () => {
    const [selectedLocationName, setSelectedLocationName] = useState<
        string | null
    >(null);
    const [coords, setCoords] = useState<[number, number]>([28.6139, 77.209]); // delhi
    const [selectedDate, setSelectedDate] = useState<string>(""); // calender
    const [trips, setTrips] = useState<Trip[]>([]);

    //  Fetch Trips by Date
    const fetchTripsByDate = async (date: string) => {
        try {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
                [Query.equal("date", date)]
            );

            // Map Appwrite documents to Trip[]
            const tripsFromDb: Trip[] = response.documents.map((doc) => ({
                id: doc.$id,
                title: doc.destination,
                activities: Array.isArray(doc.activities)
                    ? doc.activities
                    : [doc.activities],
                image: doc.image,
                isSaved: true,
                date: doc.date,
            }));
            setTrips(tripsFromDb);
        } catch (error) {
            console.error("Failed to fetch trips:", error);
        }
    };

    useEffect(() => {
        const fetchCoordinates = async () => {
            if (!selectedLocationName) return;

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${selectedLocationName}`
            );
            const data = await res.json();

            if (data && data.length > 0) {
                setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            }
        };

        fetchCoordinates();
    }, [selectedLocationName]);

    // calender date handling
    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        fetchTripsByDate(date);
    };

    //card delete
    const handleDelete = async (tripId: string) => {
        try {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
                tripId
            );
            // remove from local state
            setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId))
        } catch (error) {
            console.error("Failed tot delete trip:", error);
        }
    };

    return (
        <section className="">
            <div className="container mx-auto p-[4rem] max-w-full grid grid-cols-5 gap-12">
                {/* left / calender & map */}
                <div className="col-span-2 flex flex-col gap-5">
                    {/* calender div */}
                    <div className="flex justify-center">
                        <Calender onDateSelect={handleDateSelect} />
                    </div>
                    {/* map div */}
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <TripMap location={coords} />
                        </div>
                    </div>
                </div>
                {/* card div */}
                <div className="col-span-3 border">
                    <Card
                        setSelectedLocation={setSelectedLocationName}
                        trips={trips}
                        onDelete={handleDelete}
                    />
                    <TripCradForm
                        selectedDate={selectedDate}
                        trips={trips}
                        setTrips={setTrips}
                    />
                </div>
            </div>
        </section>
    );
};

export default FirstPage;
