import { NewsHeadlinesContainer } from "./NewsHeadlinesContainer";
import { SummaryComponent } from "@/components/SummaryComponent";

export default function GeneratePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly sm:p-4 xl:p-24">
      <h1 className="text-6xl font-bold">Today&apos;s News</h1>
      <SummaryComponent title="Help">
        <p className="p-2 md:p-4">
          This page will display a selection of the latest news headlines. Click
          on the headline to see a dialog enabling you to generate a Haiku based
          on this headline.
        </p>
      </SummaryComponent>
      <NewsHeadlinesContainer />
    </main>
  );
}
