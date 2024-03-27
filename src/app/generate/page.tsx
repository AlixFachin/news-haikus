import { Suspense } from "react";
import { NewsHeadlinesContainer } from "./NewsHeadlinesContainer";
import Spinner from "@/components/Spinner";

export default function GeneratePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      <h1 className="text-6xl font-bold">Today&apos;s News</h1>
      <Suspense fallback={<Spinner />}>
        <NewsHeadlinesContainer />
      </Suspense>
    </main>
  );
}
