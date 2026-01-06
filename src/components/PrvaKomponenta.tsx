import Scooter from "../assets/scooter.png";
const scrollToDownload = () => { document.getElementById("instalirajgabrate")?.scrollIntoView({ behavior: "smooth" }); };

function PrvaKomponenta() {

    return (
        <>

            <div className="w-full relative h-164 bg-gradient-to-t from-black via-transparent to-[#003A6B]">
                <h1 className="font-bold">Urban Move</h1>
                <h3 className="">
                    Move smarter. Discover electric scooters anywhere in the city with Urban Move
                </h3>

                <div className="grid grid-cols-3 gap-4">
                    <div></div>

                    <div className="flex justify-center items-center">
                        <button
                            onClick={scrollToDownload}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Download Now
                        </button>
                    </div>


                    <div className="pt-20 relative">
                        <div className="logo">
                            <div className="w-[380px] h-[380px] rounded-full border-l-[40px] border-l-gray-200 animate-spin absolute z-20"></div>
                        </div>
                        <img
                            src={Scooter}
                            className="pt-1 w-100 h-100 z-30 relative"
                            alt="Electric Urban Move Scooter"
                        />
                    </div>
                </div>
            </div>

        </>
    );
}

export default PrvaKomponenta;
