import Link from "next/link";
import Image from "next/image";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header className="p-5 border-2 border-black rounded-lg mx-4 my-4 flex items-center gap-4">
        <Link href="/" className="flex-shrink-0">
          <Image src="/icons/home-icon.svg" alt="Home" width={24} height={24} />
        </Link>
        <p className="flex-1 text-center">
          Some temporary header with(out) some pretty background image...
        </p>
      </header>
      {children}
      <footer className="p-5 border-2 border-black rounded-lg mx-4 my-4">
        <div className="flex gap-10 mb-5 items-end">
          <div className="p-8 border-2 border-black rounded-lg">
            <a
              href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x46525375fac17d81:0x897dc1f7339cfb8f?sa=X&ved=1t:8290&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              <p>
                Istedgade 101, 1 sal.
                <br />
                Copenhagen
                <br />
                1650, Vesterbro
              </p>
            </a>
            <br />
            <a href="mailto:Istedgade101@gmail.com" className="hover:underline">
              <p>Istedgade101@gmail.com</p>
            </a>
          </div>
          <div className="p-5 border-2 border-black rounded-lg flex-1 flex items-center justify-center gap-4">
            <a
              href="https://instagram.com/bebsisbadekar/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
            </a>
            <Link href="/terms">Terms and Conditions</Link>
            <span>-</span>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
