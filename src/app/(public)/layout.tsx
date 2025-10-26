import Link from "next/link";
import Image from "next/image";

export default function PublicLayout({
                                         children,
                                     }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            <header className="p-5 rounded-lg mx-4 my-4 flex items-center gap-4">
                <Link href="/" className="flex-shrink-0">
                    <Image src="/icons/home-icon.svg" alt="Home" width={24} height={24} />
                </Link>
                <p className="flex-1 text-right"></p>
            </header>

            {children}

            <footer className="p-5 rounded-lg mx-auto w-full max-w-screen-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-center md:text-left">
                    <div className="border-2 border-black rounded-lg flex flex-col justify-center items-center p-6 h-full">
                        <a
                            href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x46525375fac17d81:0x897dc1f7339cfb8f?sa=X&ved=1t:8290&ictx=111"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                        >
                            <p className="[font-family:var(--font-archivo),system-ui,sans-serif] leading-8 text-neutral-900 text-center">
                <span className="[font-family:var(--font-archivo-black),system-ui,sans-serif] font-black tracking-tight">
                  ADRESSE
                </span>
                                <br />
                                <span className="group-hover:underline underline-offset-4">
                  Istedgade 101, 1. sal
                  <br />
                  Copenhagen
                  <br />
                  1650, Vesterbro
                </span>
                            </p>
                        </a>
                    </div>

                    <div className="border-2 border-black rounded-lg flex flex-col justify-center items-center p-6 h-full">
                        <p className="[font-family:var(--font-archivo),system-ui,sans-serif] leading-8 text-neutral-900 text-center">
              <span className="[font-family:var(--font-archivo-black),system-ui,sans-serif] font-black">
                KONTAKT
              </span>
                            <br />
                            <a
                                href="mailto:Istedgade101@gmail.com"
                                className="hover:underline underline-offset-4 break-words"
                            >
                                Istedgade101@gmail.com
                            </a>
                        </p>
                    </div>

                    <div className="border-2 border-black rounded-lg flex flex-col justify-center items-center p-6 h-full">
                        <p className="[font-family:var(--font-archivo),system-ui,sans-serif] leading-8 text-neutral-900 text-center">
              <span className="[font-family:var(--font-archivo-black),system-ui,sans-serif] font-black">
                INSTAGRAM
              </span>
                            <br />
                            <a
                                href="https://instagram.com/bebsisbadekar/"
                                className="hover:underline underline-offset-4 inline-flex items-center justify-center"
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
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
