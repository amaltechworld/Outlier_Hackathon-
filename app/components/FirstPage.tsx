"use client"

import {useState} from "react";
import Calender from "./subComponents/Calender";
// import TripMap from "./subComponents/TripMap";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("./subComponents/TripMap"), {
    ssr: false,
});

const FirstPage = () => {

const [selectedLocation, setSelectedLocation] = useState<[number, number]>([
    9.9312, 76.2673,
]); // kochi, india

const handleCardClick = () => {
    setSelectedLocation([28.6139, 77.209]); // delhi
}

  return (
      <section className="">
          <div className="container mx-auto p-[4rem] max-w-full grid grid-cols-5 gap-12">
              {/* left / calender & map */}
              <div className="col-span-2 flex flex-col gap-5">
                  {/* calender div */}
                  <div className="flex justify-center">
                      <Calender />
                  </div>
                  {/* map div */}
                  <div className="space-y-4">
                      <button
                          onClick={handleCardClick}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                          select new delhi
                      </button>
                      <div className="flex justify-center">
                          <TripMap location={selectedLocation} />
                      </div>
                  </div>
              </div>
              {/* card div */}
              <div className="col-span-3 border">FirstPage</div>
          </div>
      </section>
  );
}

export default FirstPage