import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Anton,
  League_Spartan,
  Archivo_Black,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const spartan = League_Spartan({
  weight: ["800", "900"], // prøv 900 for maksimal tyngde
  subsets: ["latin"],
  variable: "--font-spartan",
});

export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
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
        className={`${geistSans.variable} ${geistMono.variable}${anton.variable} ${spartan.variable}
      ${archivoBlack.variable}`}
      >
        <main className="min-h-[60vh] p-5">{children}</main>
      </body>
    </html>
  );
}
