import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-svh grid grid-cols-1 md:grid-cols-2 items-center">
      <section className="order-2 md:order-1 px-6 md:px-10 py-10 md:py-0 text-white">
        <div className="max-w-lg ml-auto md:ml-0 md:mr-8 text-right md:text-left">
          <h1
            className="tracking-tight drop-shadow-lg text-4xl sm:text-5xl md:text-6xl
            [font-family:var(--font-archivo-black),system-ui,sans-serif] uppercase"
            style={{ WebkitTextStroke: "1px rgba(5,5,5,0.55)" }}
            >
            Andrea Carlberg
          </h1>
          <h2
            className="--font-archivo-black font-normal mt-2 drop-shadow text-2xl sm:text-3xl md:text-4xl"
            style={{ WebkitTextStroke: "1px rgba(5,5,5,0.55)" }}
          >
            @bebsisbadekar
          </h2>

          <div className="mt-6 flex flex-wrap gap-3 justify-end md:justify-start">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xl shadow-emerald-600/30 ring-2 ring-emerald-300/60 ring-offset-2 ring-offset-black transition-transform hover:scale-[1.03]"
            >
              <Link href="/booking" aria-label="Book tid">
                <span className="inline-flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" />
                  Book tid
                </span>
              </Link>
            </Button>

            <Button asChild variant="secondary" size="lg" className="rounded-full opacity-90 hover:opacity-100">
              <Link href="/#faq">FAQ</Link>
            </Button>

            <Button asChild variant="secondary" size="lg" className="rounded-full opacity-90 hover:opacity-100">
              <Link href="/aftercare">After care</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="order-1 md:order-2 relative h-[50vh] md:h-[80vh] px-2 md:px-0">
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="relative h-full w-[85%] md:w-[90%]">
            <Image
              src="/Andrea.png"
              alt="Andrea Carlberg"
              fill
              priority
              sizes="(max-width: 768px) 85vw, 50vw"
              className="object-contain object-right pointer-events-none select-none"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
