import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";


export default function Page() {
  return <div className="min-h-screen">
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-16 text-center">
        FAQ
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/80 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Generelle spørgsmål om tatoveringer
          </h2>
          <Accordion type="single" collapsible className="w-full text-white">
            <AccordionItem value="item-1">
              <AccordionTrigger>Gør det ondt at få en tatovering?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Ja, men graden af smerte varierer fra person til person og afhænger af tatoveringens placering. De fleste beskriver det som en brændende eller prikkende fornemmelse.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Hvor lang tid tager en tatovering?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Det afhænger af designets størrelse og detaljer. En lille tatovering kan tage 30 minutter, mens et stort projekt kan kræve flere sessioner.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Skal jeg medbringe noget til min aftale?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Bare sørg for at være udhvilet, have spist, og medbring gyldig ID. Undgå alkohol og blodfortyndende medicin før din aftale.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Hvad skal jeg gøre for at pleje min tatovering efterfølgende?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Du får detaljerede efterbehandlingsinstruktioner efter tatoveringen. Generelt skal du holde området rent, fugtigt og undgå sol, bad og stramtsiddende tøj de første dage.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Kan jeg få dækket en gammel tatovering?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Ja, det er ofte muligt at lave et cover-up, men det afhænger af farven, størrelsen og placeringen på den gamle tatovering. Book en konsultation, så vi kan vurdere det.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right column – Booking spørgsmål */}
        <div className="bg-black/80 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Spørgsmål om booking
          </h2>
          <Accordion type="single" collapsible className="w-full text-white">
            <AccordionItem value="item-1">
              <AccordionTrigger>Hvordan booker jeg en tid?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Du kan booke via vores hjemmeside, Instagram, telefon eller ved at komme forbi studiet. Ved større projekter anbefaler vi en personlig konsultation først.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Skal jeg betale et depositum?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Ja, vi tager normalt et depositum for at reservere din tid. Beløbet trækkes fra den samlede pris på tatoveringen. Depositum refunderes ikke ved aflysning med kort varsel.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Kan jeg ændre eller aflyse min tid?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Ja, men ændringer skal ske senest 48 timer før din aftale. Ved senere aflysning mister du dit depositum.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Hvor gammel skal man være for at få en tatovering?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Du skal være fyldt 18 år. Vi tatoverer ikke personer under 18 – heller ikke med forældresamtykke.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Kan jeg få et prisoverslag før jeg booker?</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Ja, send os en besked med dit designidé, størrelse og placering – så giver vi et uforpligtende estimat.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  </div>
  }
