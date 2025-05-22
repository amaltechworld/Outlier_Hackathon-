
"use client";


import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";



type Trip = {
    id: string;
    title: string;
    activities: string[];
    image: string | null;
};

type Props = {
    setSelectedLocation: (location: string) => void;
    
    trips: Trip[];
    onDelete: (tripId: string) => void;
};

const Card = ({ setSelectedLocation, trips, onDelete }: Props) => {
    const [flippedId, setFlippedId] = useState<string | null>(null);

    if (!trips || trips.length === 0) {
        return (
            <div className="p-6 text-gray-500">
                No trips available for the selected date.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
            {trips.map((trip) => {
                const isFlipped = flippedId === trip.id;

                return (
                    <div key={trip.id} className="w-72 h-80 perspective">
                        {/* flip animation */}
                        <motion.div
                            className="relative w-full h-full cursor-pointer"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ transformStyle: "preserve-3d" }}
                            onClick={() =>
                                setFlippedId((prev) =>
                                    prev === trip.id ? null : trip.id
                                )
                            }
                        >
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
                                        {trip.activities.map(
                                            (activity, idx) => (
                                                <li key={idx}>{activity}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div className="flex justify-between">
                                    {/* Location */}
                                    <button
                                        onClick={() =>
                                            setSelectedLocation(trip.title)
                                        }
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        Location
                                    </button>
                                    {/* Delete */}
                                    <button
                                        onClick={() => onDelete(trip.id)}
                                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
};

export default Card;

