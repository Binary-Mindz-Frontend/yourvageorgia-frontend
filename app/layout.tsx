

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
  title: "Solenne | One Membership. Global Privileges.",
  description: "A private membership offering preferred rates and privileges across a global network of considered longevity and beauty destinations.",
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