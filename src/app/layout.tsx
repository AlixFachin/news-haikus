import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AppMenu from "@/components/AppMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Generated Haikus of the day",
  description: "Generate a few haikus every day, based on the news of the day",
  keywords: ["haiku", "AI", "news", "Gemini", "senryu", "Japanese"],
  authors: [{ name: "Alix Fachin", url: "https://codeandpastries.dev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " text-gray-800 dark:text-white"}>
        {children}
        <AppMenu />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
