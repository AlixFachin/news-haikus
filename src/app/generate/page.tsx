import { Suspense } from "react";
import { NewsHeadlinesContainer } from "./NewsHeadlinesContainer";
import Spinner from "@/components/Spinner";
import { SummaryComponent } from "@/components/SummaryComponent";

export default function GeneratePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      <h1 className="text-6xl font-bold">Today&apos;s News</h1>
      <SummaryComponent title="Help">
        <p className="p-2 md:p-4">
          This page will display a selection of the latest news headlines. Click
          on the headline to see a dialog enabling you to generate a Haiku based
          on this headline.
        </p>
      </SummaryComponent>
      <Suspense fallback={<Spinner />}>
        <NewsHeadlinesContainer />
      </Suspense>
    </main>
  );
}
