

const FirstPage = () => {
  return (
      <section className="">
          <div className="container mx-auto p-[4rem] border max-w-full grid grid-cols-4">
              {/* left / calender & map */}
              <div className="col-span-1 flex flex-col gap-5 bg-amber-200">
                  <div>calender</div>
                  <div>map</div>
              </div>
              {/* card div */}
              <div className="col-span-3 bg-amber-800">FirstPage</div>
          </div>
      </section>
  );
}

export default FirstPage