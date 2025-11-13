"use client";

export default function BeforeBookingPage() {
    return (
        <main className="min-h-screen bg-white text-black">
            <section className="container mx-auto max-w-5xl px-6 py-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center">
                    Forberedelse inden du skal have lavet din tatovering
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 leading-relaxed text-lg">
                    {/* Venstre kolonne */}
                    <ul className="list-disc list-outside space-y-6 marker:text-black/70">
                        <li>
                            <strong>Personlig hygiejne!</strong> Vi ser helst, at du kommer
                            renlig til din session – ikke kun for artistens skyld, men også
                            for helingsprocessen efterfølgende.
                        </li>

                        <li>
                            Sørg for at din væskebalance er på plads – drik mindst 2 liter
                            vand dagligt i dagene op til din tid. Et højt væskeniveau hjælper
                            kroppen med at holde huden fugtig og gør kroppen mere modtagelig
                            for blæk. En sund væskebalance hjælper også huden med at holde til
                            belastningen under tatoveringen.
                        </li>

                        <li>
                            Sørg for at få en god nats søvn, så du er frisk og udhvilet, når
                            du møder op. Søvn hjælper dig med at klare tiden under nålen.
                            Undgå alkohol og smertestillende i dagene op til din aftale – det
                            fortynder blodet og kan gøre sessionen ubehagelig.
                        </li>
                    </ul>

                    {/* Højre kolonne */}
                    <ul className="list-disc list-outside space-y-6 marker:text-black/70">
                        <li>
                            Spis godt i dagene op til din aftale, og få fyldt dine energidepoter
                            op. Spis frugt og grønt, og prøv at få så meget C-vitamin som muligt
                            – det styrker immunforsvaret og gør helingsprocessen lettere.
                        </li>

                        <li>
                            Spis et solidt måltid mad inden du møder op. Din krop klarer sig
                            bedre, hvis den er fyldt med energi. Tag evt. snacks eller frugt
                            med for at holde et stabilt blodsukker under sessionen.
                        </li>

                        <li>
                            Overvej at tage lidt underholdning med, hvis du skal sidde længe –
                            musik, film, en bog eller noget andet, der får tiden til at gå
                            hurtigere. Du er altid velkommen til at medbringe det, der hjælper
                            dig med at slappe af.
                        </li>
                    </ul>
                </div>

                <div className="text-center mt-16 text-slate-600 text-base">
                    Du kan også læse mere om pleje efter tatoveringen i vores{" "}
                    <a
                        href="/aftercare"
                        className="text-green-600 hover:underline font-medium"
                    >
                        aftercare
                    </a>{" "}
                    sektion – eller tjek vores{" "}
                    <a
                        href="/faq"
                        className="text-green-600 hover:underline font-medium"
                    >
                        FAQ
                    </a>{" "}
                    hvis du har spørgsmål.
                </div>
            </section>
        </main>
    );
}
