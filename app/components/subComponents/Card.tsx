
"use client";

import Image from "next/image";

type SavedTrip = {
    id: string;
    title: string;
    activities: string[];
    image: string | null;
};

type Props = {
    setSelectedLocation: (location: string) => void;
};
export interface CardProps {
    selectedLocation: [number, number];
    setSelectedLocation: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const Card = ({ setSelectedLocation }: Props) => {
    const savedTrips: SavedTrip[] = [
        {
            id: "1",
            title: "Singapore",
            activities: ["Gardens by the Bay"],
            image: "",
        },
        {
            id: "2",
            title: "Tokyo",
            activities: ["Shibuya Crossing", "Tokyo Tower"],
            image: "https://unsplash.com/photos/a-lush-green-hillside-under-a-cloudy-blue-sky-2vvfAno1TKQ",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
            {savedTrips.map((trip) => (
                <div
                    key={trip.id}
                    className="w-72 h-80 group-[perspective:1000px] cursor-pointer"
                >
                    <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
                        {/* Front */}
                        <div className="absolute w-full h-full [backface-visibility:hidden]">
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                {trip.image ? (
                                    <Image
                                        src={trip.image}
                                        alt={trip.title}
                                        fill
                                        unoptimized
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back */}
                        <div className="absolute w-full h-full [backface-visibility:hidden] rotate-y-180 bg-white rounded-xl shadow p-4 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">
                                    {trip.title}
                                </h2>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    {trip.activities.map((activity, idx) => (
                                        <li key={idx}>{activity}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <button
                                    onClick={() =>
                                        setSelectedLocation(trip.title)
                                    }
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card;
