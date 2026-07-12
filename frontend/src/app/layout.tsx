import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripMind AI — Your AI Travel Companion",
  description:
    "Plan your perfect trip with the power of AI. Get personalized itineraries, local recommendations, and travel tips powered by GPT-4.",
  keywords: ["travel", "AI", "itinerary", "trip planner", "travel companion"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 font-sans">{children}</body>
    </html>
  );
}
