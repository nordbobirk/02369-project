"use client";
import { CheckCircle } from "lucide-react";

export default function Confirm() {
    return (
        <section className="-mx-[calc(50vw-50%)] w-screen min-h-svh p-8">
            <div className="pointer-events-none fixed inset-0 z-50 border-2 border-black" />

            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-6 rounded-2xl border-2 border-black p-6
                flex flex-col items-center justify-center text-center gap-4
                min-h-[320px] md:min-h-[50svh]">
                    <h1 className="text-4xl font-bold text-black">
                        Din booking er hermed indsendt!
                    </h1>
                    <CheckCircle className="h-40 w-40 text-green-500" />
                </div>

                <div className="md:col-span-6 rounded-2xl border-2 border-black p-6 flex flex-col gap-8">
                    <div className="rounded-2xl border-2 border-black bg-black p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">Hvad sker der nu?</h3>
                        <p className="leading-relaxed opacity-90">
                            Vi gennemgår din booking og vender hurtigst muligt tilbage på din bookingforespørgsel.
                        </p>
                    </div>

                    <div className="rounded-2xl border-2 border-black bg-black p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">Forberedelse før din tid</h3>
                        <p className="leading-relaxed opacity-90">
                            For at få så god en oplevelse som muligt råder vi til at du får en god nats søvn inden din
                            tatovering, og undgå alkohol og smertestillende, da de
                            fortynder blodet og kan give mere blødning. Bliv ikke tatoveret, hvis du er syg, og drik
                            rigeligt vand for at hjælpe kroppen og gøre huden lettere at arbejde med.
                            Spis et godt måltid før din aftale, så du ikke får lavt blodsukker, og tag behageligt,
                            løstsiddende tøj på. Hold dig fra alkohol på dagen, og medbring gerne noget, der kan
                            distrahere dig undervejs – det gør oplevelsen mere behagelig. Du kan også læse mere
                            om forløbet efter tatoveringen i vores <a href="/aftercare" className="text-green-500
                            hover:underline">aftercare</a> sektion.
                            Hvis du har flere spørgsmål er du altid velkommen til at tage fat i os - Ellers håber vi at
                            dine sidste spørgsmål kan besvares af vores <a href="/faq" className="text-green-500 hover:underline">FAQ</a>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
