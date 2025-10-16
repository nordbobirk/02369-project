import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-svh p-8 bg-[url('/baggrund.png')] bg-fixed bg-cover bg-center">
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
      <h1
        className="font-serif font-normal tracking-wide drop-shadow-lg text-4xl sm:text-5xl md:text-6xl"
        style={{ WebkitTextStroke: "1px rgba(5,5,5,5.5)" }}
      >
        Fabel Tattoo Studio
      </h1>

      <h2
        className="font-serif font-normal mt-2 drop-shadow text-2xl sm:text-3xl md:text-4xl"
        style={{ WebkitTextStroke: "0.5px rgba(5,5,5,5.5)" }}
      >
        Andrea Carlberg
      </h2>
    </div>
    <Button asChild size="lg" className="rounded-full">
      <Link href="/booking">Book tid</Link>
    </Button>

    <Button asChild size="lg" className="rounded-full">
      <Link href="/#faq">FAQ</Link>
    </Button>

    <Button asChild size="lg" className="rounded-full">
      <Link href="/aftercare">After care</Link>
    </Button>
    </main>
  );
}






