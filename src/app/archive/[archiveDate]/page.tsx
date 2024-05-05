import { Suspense } from "react";
import { DayHaikuContainer } from "@/components/DayHaikuContainer";
import DateSwitcher from "@/components/DateSwitcher";
import Spinner from "@/components/Spinner";
import dayjs from "dayjs";
import { Metadata } from "next";
import { RedirectType, redirect } from "next/navigation";
import { getDateFormatJapanTimeFromDayjs } from "@/utils/datetimeUtils";

// TODO -> Put in a higher value to avoid re-rendering the same page all over again
export const revalidate = 0;

export function generateMetadata({
  params,
}: {
  params: { archiveDate: string };
}): Metadata {
  const archiveDate = dayjs(params.archiveDate);
  return {
    // The other fields are inherited by the root-level layout
    title: `AI-Generated Haikus for ${archiveDate.format("DD-MMM-YYYY")}`,
  };
}

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
          {<DayHaikuContainer haikuDate={archiveDate.toDate()} />}
        </Suspense>
      </section>
      <DateSwitcher currentDate={archiveDate.toDate()} />
    </main>
  );
}
