import { HomeDisclaimer } from "@/components/HomeDisclaimer";
import { Metadata } from "next";
import HaikuScrollContainer from "@/components/HaikuScrollContainer";

// Meta-Data
export const metadata: Metadata = {
  title: "AI-Generated Haikus of the day",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col flex-wrap items-center justify-evenly sm:p-4 xl:p-24">
      <h1 className="mb-4 text-4xl font-bold sm:text-6xl md:mb-8">
        Today&apos;s Haikus
      </h1>
      <HomeDisclaimer />
      <HaikuScrollContainer />
    </main>
  );
}
