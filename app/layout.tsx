import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shemoqmedi.space — The Voloo Ecosystem",
  description:
    "Ultra-premium NFC-enabled handcrafted hardware for hospitality. Artisan coasters, smart cards, and venue tags that bridge physical craft with digital frictionless.",
  keywords: [
    "NFC hardware",
    "hospitality technology",
    "smart coasters",
    "handcrafted NFC",
    "Voloo",
    "Shemoqmedi",
  ],
  openGraph: {
    title: "Shemoqmedi.space — The Voloo Ecosystem",
    description:
      "Handcrafted NFC hardware for the hospitality elite. Physical craft meets digital frictionless.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased dark", inter.variable)}>
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
