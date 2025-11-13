import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Anton,
  League_Spartan,
  Archivo_Black,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const spartan = League_Spartan({
  weight: ["800", "900"],
  subsets: ["latin"],
  variable: "--font-spartan",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

const tropiLand = localFont({
  src: [
    {
      path: "./fonts/tropi-land/Tropi Land - (Demo) hanscostudio.com.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-tropi-land",
  display: "swap"
});

const urbane = localFont({
  src: [
    { 
      path: "./fonts/urbane/Urbane-Medium.ttf",
      weight: "400",
      style: "normal"
    }
  ],
  variable: "--font-urbane",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Bebsis Booking",
  description: "Book tid til tatovering hos Andrea Carlberg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}${anton.variable} ${spartan.variable} ${archivoBlack.variable} ${tropiLand.variable} ${urbane.variable}`}
      >
        <main className="min-h-[60vh] p-5">{children}</main>
      </body>
    </html>
  );
}
