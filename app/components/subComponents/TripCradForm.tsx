

"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";

type Trip = {
    id: string;
    title: string;
    activities: string[];
    image: string | null;
    isSaved: boolean;
};

const TripCardForm: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [imageSelectMode, setImageSelectMode] = useState<{
        tripId: string;
        open: boolean;
    }>({ tripId: "", open: false });

    const activityRef = useRef<{ [tripId: string]: HTMLInputElement | null }>(
        {}
    );
    const [imageUrlInput, setImageUrlInput] = useState("");

    const handleAddTrip = () => {
        if (trips.length >= 5) return;
        setTrips([
            ...trips,
            {
                id: Date.now().toString(),
                title: "",
                activities: [""],
                image: null,
                isSaved: false,
            },
        ]);
    };

    const handleTripChange = (
        id: string,
        field: keyof Trip,
        value: string | string[] | null
    ) => {
        setTrips((trips) =>
            trips.map((trip) =>
                trip.id === id ? { ...trip, [field]: value } : trip
            )
        );
    };

    const handleActivityChange = (
        tripId: string,
        actIdx: number,
        value: string
    ) => {
        setTrips((trips) =>
            trips.map((trip) =>
                trip.id === tripId
                    ? {
                          ...trip,
                          activities: trip.activities.map((act, idx) =>
                              idx === actIdx ? value : act
                          ),
                      }
                    : trip
            )
        );
    };

    const handleAddActivity = (tripId: string) => {
        setTrips((trips) =>
            trips.map((trip) =>
                trip.id === tripId && trip.activities.length < 5
                    ? { ...trip, activities: [...trip.activities, ""] }
                    : trip
            )
        );
        setTimeout(() => {
            activityRef.current[tripId]?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleImageURLInput = (tripId: string, url: string) => {
        setTrips((prevTrips) =>
            prevTrips.map((trip) =>
                trip.id === tripId ? { ...trip, image: url } : trip
            )
        );
        setImageSelectMode({ tripId: "", open: false });
    };

    const handleImageUpload = (tripId: string, file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setTrips((trips) =>
                trips.map((trip) =>
                    trip.id === tripId
                        ? { ...trip, image: reader.result as string }
                        : trip
                )
            );
        };
        reader.readAsDataURL(file);
    };

    const handleSaveTrip = (tripId: string) => {
        setTrips((trips) =>
            trips.map((trip) =>
                trip.id === tripId ? { ...trip, isSaved: true } : trip
            )
        );
    };

    const handleRemoveTrip = (tripId: string) => {
        setTrips((trips) => trips.filter((trip) => trip.id !== tripId));
    };

    return (
        <>
            <div className="flex gap-4 p-6 flex-wrap">
                {trips
                    .filter((trip) => !trip.isSaved)
                    .map((trip) => (
                        <div
                            key={trip.id}
                            className="relative w-72 p-4 pt-8 h-80 bg-white rounded-xl space-y-4 overflow-y-auto overflow-x-hidden custom-scroll scroll-smooth"
                        >
                            <button
                                onClick={() => handleRemoveTrip(trip.id)}
                                className="absolute top-1 right-2 text-red-500 font-bold text-lg border border-stone-300"
                                title="Remove"
                            >
                                <X size={20} />
                            </button>

                            <input
                                type="text"
                                placeholder="Travel destination"
                                value={trip.title}
                                onChange={(e) =>
                                    handleTripChange(
                                        trip.id,
                                        "title",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded"
                            />

                            <div className="space-y-2">
                                {trip.activities.map((activity, actIdx) => {
                                    const isLast =
                                        actIdx === trip.activities.length - 1;
                                    return (
                                        <input
                                            key={actIdx}
                                            type="text"
                                            placeholder={`Activity ${
                                                actIdx + 1
                                            }`}
                                            value={activity}
                                            onChange={(e) =>
                                                handleActivityChange(
                                                    trip.id,
                                                    actIdx,
                                                    e.target.value
                                                )
                                            }
                                            ref={
                                                isLast
                                                    ? (el) => {
                                                          activityRef.current[
                                                              trip.id
                                                          ] = el;
                                                      }
                                                    : null
                                            }
                                            className="w-full p-2 border rounded"
                                        />
                                    );
                                })}
                                {trip.activities.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddActivity(trip.id)
                                        }
                                        className="text-sm text-blue-500 cursor-pointer"
                                    >
                                        + Add Activity
                                    </button>
                                )}
                            </div>

                            {/* Image Upload & Modal Trigger */}
                            <div className="space-y-2">
                                {trip.image && (
                                    <Image
                                        src={trip.image}
                                        alt="trip"
                                        width={500}
                                        height={128}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setImageSelectMode({
                                            tripId: trip.id,
                                            open: true,
                                        })
                                    }
                                    className="w-full border rounded px-4 py-2 text-center cursor-pointer text-blue-500 hover:text-blue-700"
                                >
                                    📷 Choose Destination Image
                                </button>

                                {/* Hidden Input for Image Upload */}
                                <input
                                    type="file"
                                    id={`fileInput-${trip.id}`}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleImageUpload(
                                            trip.id,
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleSaveTrip(trip.id)}
                                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
                                disabled={trip.isSaved}
                            >
                                Save Trip
                            </button>
                        </div>
                    ))}

                {!trips.some((trip) => !trip.isSaved) && trips.length < 5 && (
                    <button
                        type="button"
                        onClick={handleAddTrip}
                        className="w-72 h-[20rem] border border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-500 cursor-pointer"
                    >
                        <Plus size={32} />
                        <span>Add New Trip</span>
                    </button>
                )}
            </div>

            {/* Modal */}
            {imageSelectMode.open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-xl">
                        <h2 className="text-lg font-semibold text-center">
                            Choose Image Source
                        </h2>

                        <button
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                            onClick={() => {
                                document
                                    .getElementById(
                                        `fileInput-${imageSelectMode.tripId}`
                                    )
                                    ?.click();
                                setImageSelectMode({ tripId: "", open: false });
                            }}
                        >
                            📁 Choose from System
                        </button>

                        <input
                            type="text"
                            placeholder="Paste image URL (https://...)"
                            className="w-full border rounded p-2"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleImageURLInput(
                                        imageSelectMode.tripId,
                                        imageUrlInput
                                    );
                                    setImageUrlInput("");
                                }
                            }}
                        />
                        <button
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mt-2"
                        onClick={() => {
                            handleImageURLInput(imageSelectMode.tripId, imageUrlInput);
                            setImageUrlInput("");
                        }}
                        >
                            Save Image URL
                        </button>

                        <button
                            className="text-sm text-gray-500 hover:text-gray-700 underline block mx-auto"
                            onClick={() =>
                                setImageSelectMode({ tripId: "", open: false })
                            }
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TripCardForm;
