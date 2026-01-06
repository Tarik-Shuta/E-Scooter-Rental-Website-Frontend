import Prva from "../assets/firstimage.png"
import Druga from "../assets/secondimage.png"
import Treca from "../assets/thirdimage.png"
import PlayStore from "../assets/google-play-svgrepo-com.svg"
import AppStore from "../assets/app-store-svgrepo-com.svg"

function DrugaKomponenta() {

    return(
        <>
    <div className="w-full relative h-164 bg-linear-to-b from-black to-transparent">
        <h2 className="pt-5">An Eco-Friendly travelling companion</h2>
        <div className="grid grid-cols-3 rows-2">

        <div className="flex justify-center pt-16">
            <img src={Prva} className="relative w-55" alt="slika"/>
        </div>


        <div className="flex justify-center pt-16"> <img src={Druga} className="relative w-55" alt="slika"/>

        </div>


        <div className="flex justify-center pt-16"> <div> <img src={Treca} className="relative w-55" alt="slika"/></div>
        </div>

            <div>
                <p>Move through the city with ease—UrbanMove makes every <br />ride simple, fun, and effortless.</p>
            </div>


            <div><p>Skip the traffic, forget the stress, and enjoy true<br /> freedom on every UrbanMove ride.</p></div>


            <div><p>Powering livable cities with clean electric energy—no gas,<br /> no noise, just a better future.</p></div>

        </div>

    </div>
    <div className="w-full pb-30">
        <div className="grid grid-cols-2">
            <div className="pt-30">


                <p className="pt-16 text-lg">Opportunities are waiting for you</p>
                <p className="pr-35 text-xl">at UrbanMove</p>


            </div>
            <div id="instalirajgabrate" className="pt-30">

                <div className="">
                    <button type="button" className="inline-flex" onClick={() => window.open("https://play.google.com/store", "_blank")}>
                        <img src={PlayStore} alt="Google Play Store" className="size-10 mr-2"/>
                        <p className="text-2xl pt-1">Playstore</p>
                    </button>

                </div>
                <div className="pt-20">
                    <button type="button" className="inline-flex" onClick={() => window.open("https://www.apple.com/app-store/", "_blank")}>
                        <img src={AppStore} alt="App Store" className="size-10 mr-2"/>
                        <p className="text-2xl pt-1">Appstore</p>
                    </button>
                </div>



            </div>
        </div>

    </div>
    </>
    )
}
export default DrugaKomponenta;