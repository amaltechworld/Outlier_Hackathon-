"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
// app write
import { databases, storage, ID } from "../../../lib/appwriteConfig";


type Trip = {
    id: string;
    title: string;
    activities: string[];
    image: string | null;
    isSaved: boolean;
    date: string;
};

type TripCardFormProps = {
    selectedDate: string;
    trips: Trip[];
    setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
};

const TripCardForm =({ selectedDate, trips, setTrips}: TripCardFormProps ) => {
    
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
                date: selectedDate,
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

    const handleRemoveTrip = (tripId: string) => {
        setTrips((trips) => trips.filter((trip) => trip.id !== tripId));
    };

    // app write
    const handleSaveTrip = async (tripId: string) => {
        const trip = trips.find((t) => t.id === tripId);
        if (!trip || !trip.title || !trip.image || !trip.date) return;

        try {
            // if image is a file (base64), upload to Appwrite Storage
            let imageUrl = trip.image;
            if (trip.image.startsWith("data:")) {
                const file = await storage.createFile(
                    "682c185c000309996ae2",
                    ID.unique(),
                    dataURLtoFile(trip.image, `${trip.title}.png`)
                );
                imageUrl = file.$id; // store file id
            }

            // save trip to appwruite Database
            await databases.createDocument(
                "682c14360034a42497da",
                "682c1472002448adbbfe",
                ID.unique(),
                {
                    destination: trip.title,
                    activities: trip.activities,
                    image: imageUrl,
                    date: trip.date,
                }
            );
            setTrips((trips) =>
                trips.map((t) =>
                    t.id === tripId ? { ...t, isSaved: true } : t
                )
            );
        } catch (error) {
            console.error("Failed to save trip:", error);
        }
    };

    // Helper to convert base64 to File
    function dataURLtoFile(dataurl: string, filename: string) {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }



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
                            {/* Travel destination */}

                            <label className="block text-sm font-medium text-gray-700">
                                Travel destination
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Travel destination "
                                value={trip.title}
                                onChange={(e) =>
                                    handleTripChange(
                                        trip.id,
                                        "title",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded"
                                required
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
                                {trip.image &&
                                    (trip.image.startsWith("http") ? (
                                        <img
                                            src={trip.image}
                                            alt="Trip image"
                                        />
                                    ) : (
                                        <Image
                                            src={trip.image}
                                            alt="Trip image"
                                            width={400}
                                            height={300}
                                        />
                                    ))}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setImageSelectMode({
                                            tripId: trip.id,
                                            open: true,
                                        })
                                    }
                                    className="w-full border rounded px-4 py-2 text-center text-blue-500 hover:text-blue-700 cursor-pointer inline-flex"
                                >
                                    📷 Choose Destination Image{" "}
                                    <span className="text-red-500">*</span>
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
                                className={`mt-2 w-full py-2 px-4 rounded cursor-pointer ${
                                    trip.title && trip.image
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-gray-400 cursor-not-allowed text-gray-200"
                                }`}
                                disabled={
                                    !trip.title || !trip.image || trip.isSaved
                                }
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
                                handleImageURLInput(
                                    imageSelectMode.tripId,
                                    imageUrlInput
                                );
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
