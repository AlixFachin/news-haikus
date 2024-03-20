import { DayHaikuContainer } from "@/components/HaikuContainer";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import DateSwitcher from "@/components/DateSwitcher";

// Setting the page revalidation cache options
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = 0;

export default function Home() {
  const todayDate = new Date();

  return (
    <main className="flex min-h-screen flex-col flex-wrap items-center justify-evenly sm:p-4 xl:p-24">
      <h1 className="mb-4 text-4xl font-bold sm:text-6xl md:mb-8">
        Today&apos;s Haikus
      </h1>
      <section>
        <Suspense fallback={<Spinner />}>
          {<DayHaikuContainer shouldGenerate={true} haikuDate={todayDate} />}
        </Suspense>
      </section>
      <DateSwitcher currentDate={todayDate} />
    </main>
  );
}
