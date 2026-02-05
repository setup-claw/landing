import type { Metadata } from "next";
import { Space_Grotesk, Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap"
});

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "QuickClaw",
  description: "Launch your OpenClaw and add skills in 60 seconds."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${space.variable} ${chakra.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-void text-holo font-body">
        {children}
      </body>
    </html>
  );
}
