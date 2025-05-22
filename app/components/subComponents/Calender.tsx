"use client"

import {DayPicker} from "react-day-picker";
import {useEffect, useState} from "react";
import "react-day-picker/dist/style.css";
import { databases  } from "@/lib/appwriteConfig";
import { Query } from "appwrite";

type CalenderProps = {
    onDateSelect: (date: string) => void;
};


const Calender = ({ onDateSelect }: CalenderProps) => {


    const [selected, setSelected] = useState<Date | undefined> (undefined); // typescript |date select
    const [scheduled, setScheduled] = useState<Date[]>([]);

useEffect(() => {
    const fetchScheduledDates = async () => {
        try {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
                [
                    Query.select(["date"]), //
                ]
            );
            const dates = response.documents.map(
                (doc) => new Date(doc.date + "T00:00:00")
            );
            setScheduled(dates)
        } catch (error) {
            console.error("Failed to fetch scheduled dates:", error);
            
        }
    }
    fetchScheduledDates();
}, [])

function formatDateLocal(date: Date): string {
    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
}
  return (
      <div className="bg-[#f3f4ef] p-4 rounded-xl shadow-2xl z-10 min-w-[350px] ">
          <h2 className="text-lg font-semibold text-[#47663B] text-center">
              Your Travel Calender
          </h2>
          <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                  setSelected(date);
                  if (date) {
                    
                    onDateSelect(formatDateLocal(date));

                  }
              }}
              modifiers={{ scheduled : scheduled }}
              modifiersClassNames={{
                  selected: "bg-sky-500 text-white",
                  scheduled: "bg-green-700 text-black font-normal",
                  today: "text-sky-600 font-bold",
              }}
              className="text-gray-800"
          />
          {selected && (
              <p className="text-sm mt-2 text-center">
                  Selected: {selected.toLocaleDateString()}
              </p>
          )}
      </div>
  );
}

export default Calender