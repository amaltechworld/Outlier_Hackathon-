import Calender from "./subComponents/Calender";
import TripMap from "./subComponents/TripMap";


const FirstPage = () => {
  return (
      <section className="">
          <div className="container mx-auto p-[4rem] border max-w-full grid grid-cols-5 gap-12">
              {/* left / calender & map */}
              <div className="col-span-2 flex flex-col gap-5">
                  <div className="flex justify-center">
                      <Calender />
                  </div>
                  <div>
                    <TripMap />
                  </div>
              </div>
              {/* card div */}
              <div className="col-span-3 bg-amber-800">FirstPage</div>
          </div>
      </section>
  );
}

export default FirstPage