"use client"

import {useState, useEffect} from "react";
import Calender from "./subComponents/Calender";
import dynamic from "next/dynamic";
import TripCradForm from "./subComponents/TripCradForm";
import Card from "./subComponents/Card";

const TripMap = dynamic(() => import("./subComponents/TripMap"), {
    ssr: false,
});



// const [selectedLocation, setSelectedLocation] = useState<[number, number]>([
//     9.9312, 76.2673,
// ]); // kochi, india

const FirstPage = () => {
    const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);
    const [coords, setCoords] = useState<[number, number] >([
        28.6139, 77.209,
    ]); // delhi
  
    useEffect(() => {
      const fetchCoordinates = async () => {
        if (!selectedLocationName) return;
  
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${selectedLocationName}`);
        const data = await res.json();
  
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } 
      };
  
      fetchCoordinates();
    }, [selectedLocationName]);

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

                      <div className="flex justify-center">
                          <TripMap location={coords} />
                      </div>
                  </div>
              </div>
              {/* card div */}
              <div className="col-span-3 border">
                <Card setSelectedLocation={setSelectedLocationName}/>
                  <TripCradForm />
              </div>
          </div>
      </section>
  );
}

export default FirstPage