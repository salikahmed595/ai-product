import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aesthetic AI — 24/7 AI Receptionist for Aesthetic Clinics",
  description: "Deploy an intelligent AI agent that handles phone calls, answers patient queries, and books appointments 24/7 without double-booking. Built exclusively for aesthetic clinics.",
  keywords: "AI receptionist, aesthetic clinic, appointment booking, AI phone agent, clinic automation",
  openGraph: {
    title: "Aesthetic AI — Never Miss a Booking Again",
    description: "The first AI receptionist built exclusively for aesthetic clinics. 500+ clinics trust us to handle their calls 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
