

import Providers from "@/providers/Providers";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Solenne | Private Membership for Wellness & Lifestyle in Dubai",
  description: "A private membership platform offering selective access to leading wellness, hospitality and lifestyle destinations across Dubai. Annual digital membership.",
  appleWebApp: {
    title: "Solenne",
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to API */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BASE_API} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BASE_API} />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased max-w-screen overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}