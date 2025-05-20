"use client"

import {DayPicker} from "react-day-picker";
import {useState} from "react";
import "react-day-picker/dist/style.css";

const Calender = () => {

    const scheduled = [
        new Date(2025, 4, 25), //May 25 2025
        new Date(2025, 4, 28), // may 28 2025
        new Date(2025, 5, 2), // June 2 2025
    ]

    const [selected, setSelected] = useState<Date | undefined> (undefined); // typescript |date select
  return (
      <div className="bg-[#f3f4ef] p-4 rounded-xl shadow-2xl z-10 min-w-[350px] ">
          <h2 className="text-lg font-semibold text-[#47663B] text-center">
              Your Travel Calender
          </h2>
          <DayPicker
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiers={{ scheduled }}
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