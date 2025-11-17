import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const images = ["c1.jpg", "c2.jpg", "c3.jpg", "c4.jpg", "c5.jpg"];

export default function Home() {
    return (
        <main className="min-h-svh bg-white grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 md:items-center">
            <section className="order-1 px-6 md:px-10 pt-10 md:pt-0">
                <div className="max-w-[22rem] sm:max-w-md md:max-w-lg mx-auto md:mx-0 md:mr-8 text-center md:text-left">
                    <h1
                        className="tracking-tight drop-shadow text-white text-sm sm:text-xl md:text-xl
            [font-family:var(--font-archivo-black),system-ui,sans-serif] uppercase
            [-webkit-text-stroke:1px_#111]"
                    >
                        Tattoo Artist Copenhagen
                    </h1>
                    <h2
                        className="tracking-tight drop-shadow text-white text-4xl sm:text-5xl md:text-6xl leading-[0.95]
            [font-family:var(--font-archivo-black),system-ui,sans-serif] uppercase
            [-webkit-text-stroke:1px_#111]"
                    >
                        Andrea Carlberg
                    </h2>
                    <h3
                        className="mt-3 drop-shadow text-white text-2xl sm:text-3xl md:text-4xl leading-snug
            [font-family:var(--font-archivo-black),system-ui,sans-serif]
            [-webkit-text-stroke:1px_#111]"
                    >
                        <a
                            href="https://instagram.com/bebsisbadekar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-4 hover:underline"
                        >
                            @bebsisbadekar
                        </a>
                    </h3>

                    <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                        <Button asChild size="lg" className="rounded-full opacity-90 hover:opacity-100">
                            <Link href="/booking" aria-label="Book tid">
                <span className="inline-flex items-center gap-2">
                  <CalendarClock className="h-5 w-5" />
                  Book tid
                </span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="rounded-full opacity-90 hover:opacity-100"
                        >
                            <Link href="/faq">FAQ</Link>
                        </Button>

                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="rounded-full opacity-90 hover:opacity-100"
                        >
                            <Link href="/aftercare">Aftercare</Link>
                        </Button>

                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="rounded-full opacity-90 hover:opacity-100"
                        >
                            <Link href="/beforeBooking">Før din tid</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="order-2 w-full flex justify-center px-0 sm:px-4 md:px-0 mt-2 md:mt-0">
                <Carousel
                    orientation="horizontal"
                    opts={{ align: "start" }}
                    className="relative w-screen max-w-none sm:w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl"
                >
                    <CarouselContent className="h-[360px] sm:h-[420px] md:h-[560px]">
                        {images.map((name, index) => (
                            <CarouselItem key={name} className="pt-3">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="p-0">
                                            <div className="relative w-full overflow-hidden rounded-none sm:rounded-md h-[320px] sm:h-[380px] md:h-[520px]">
                                                <Image
                                                    src={`https://eophsfoggdyfhmcwtnhf.supabase.co/storage/v1/object/public/assets/CarouselContent/${name}`}
                                                    alt={`Slide ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 900px"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20
                 h-10 w-10 rounded-full bg-white/80 hover:bg-white
                 border shadow backdrop-blur-sm"
                    />
                    <CarouselNext
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20
                 h-10 w-10 rounded-full bg-white/80 hover:bg-white
                 border shadow backdrop-blur-sm"
                    />
                </Carousel>
            </section>

        </main>
    );
}
