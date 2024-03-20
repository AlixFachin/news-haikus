import { Suspense } from "react";
import { DayHaikuContainer } from "@/components/HaikuContainer";
import DateSwitcher from "@/components/DateSwitcher";
import Spinner from "@/components/Spinner";
import dayjs from "dayjs";

// TODO -> Put in a higher value to avoid re-rendering the same page all over again
export const revalidate = 0;

export default function ArchivePage({
  params,
}: {
  params: { archiveDate: string };
}) {
  const archiveDate = dayjs(params.archiveDate);

  return (
    <main className="flex min-h-screen flex-col flex-wrap items-center justify-evenly sm:p-4 xl:p-24">
      <h1 className="mb-4 text-4xl font-bold sm:text-6xl md:mb-8">
        Haikus for {dayjs(archiveDate).format("DD-MMM-YYYY")}
      </h1>
      <section>
        <Suspense fallback={<Spinner />}>
          {
            <DayHaikuContainer
              shouldGenerate={false}
              haikuDate={archiveDate.toDate()}
            />
          }
        </Suspense>
      </section>
      <DateSwitcher currentDate={archiveDate.toDate()} />
    </main>
  );
}
