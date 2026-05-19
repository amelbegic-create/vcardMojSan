import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MojSan VCard — Digitalne Vizit Kartice",
  description: "Kreirajte profesionalne digitalne vizit kartice za vaše klijente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
