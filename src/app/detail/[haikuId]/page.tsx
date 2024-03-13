import { HaikuCard } from "@/components/HaikuCard";
import {
  getAllHaikuIdsFromFirebase,
  fetchOneHaikuFromFirebase,
} from "@/utils/firebase";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";

/**
 * generateStaticParams is useful for generating static paths for all HaikuIDs.
 * @returns list of haikuIds parameters used by Next to generate static pages at build time
 */
export async function generateStaticParams() {
  const haikus = await getAllHaikuIdsFromFirebase();
  return haikus.map((haikuId) => ({ haikuId: haikuId }));
}

export default async function HaikuDetailPage({
  params,
}: {
  params: { haikuId: string };
}) {
  const haiku = await fetchOneHaikuFromFirebase(params.haikuId);
  if (!haiku) {
    notFound();
  }

  console.log(JSON.stringify(haiku));

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly sm:p-4 xl:p-24">
      <section className="flex w-[400px] flex-col items-start justify-start rounded-xl bg-gradient-to-br from-orange-200 to-orange-300 p-4 dark:from-blue-900 dark:to-blue-700">
        <div className="mb-2 self-end p-2 font-light">
          {dayjs(haiku.date).format("DD-MMM-YY")}
        </div>
        <div className="mb-4 self-center text-center text-xl font-light">
          <a href={haiku.articleUrl}>{haiku.articleTitle}</a>
        </div>
        <div className="mb-2 self-center ">
          <HaikuCard japaneseHaiku={haiku.senryu} />
        </div>
        <div className="mb-2">
          Reading:{" "}
          {haiku.reading.split("\n").map((readingLine, index) => (
            <p className="ml-4" key={`readingLine-${index}`}>
              {readingLine}
            </p>
          ))}
        </div>
        <div className="mb-2">
          Translation:{" "}
          {haiku.en.split("\n").map((enLine, index) => (
            <p className="ml-4" key={`enLine-${index}`}>
              {enLine}
            </p>
          ))}
        </div>
        <div className="mb-2">Topic: {haiku.topic}</div>
        <div className="flex w-full items-center justify-center">
          <Link
            href="/"
            className="rounded-md bg-orange-300 p-2 text-sm shadow-sm dark:bg-blue-950"
          >
            Back
          </Link>
        </div>
      </section>
    </main>
  );
}
