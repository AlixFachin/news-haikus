import { HaikuCard } from "@/components/HaikuCard";
import {
  getAllHaikuIdsFromFirebase,
  fetchOneHaikuFromFirebase,
} from "@/utils/firebase";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";
import { Metadata } from "next";
import BackButton from "./BackButton";

/**
 * generateStaticParams is useful for generating static paths for all HaikuIDs.
 * @returns list of haikuIds parameters used by Next to generate static pages at build time
 */
export async function generateStaticParams() {
  const haikus = await getAllHaikuIdsFromFirebase();
  return haikus.map((haikuId) => ({ haikuId: haikuId }));
}

export function generateMetadata({
  params,
}: {
  params: { haikuId: string };
}): Metadata {
  // TODO: Generate the OpenGraph image corresponding to the haiku detail page
  return {
    title: "AI-Generated Haikus (Detail)",
    description: "Details of a AI-generated haiku based on the news of the day",
    keywords: ["haiku", "AI", "news", "Gemini", "senryu", "Japanese"],
    authors: [{ name: "Alix Fachin", url: "https://codeandpastries.dev" }],
  };
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly sm:p-4 xl:p-24">
      <section className="flex max-w-[850px] flex-col items-start justify-start rounded-xl bg-gradient-to-br from-orange-200 to-orange-300 p-4 dark:from-blue-900 dark:to-blue-700">
        <div className="mb-2 self-end p-2 font-light">
          {dayjs(haiku.date).format("DD-MMM-YY")}
        </div>
        <h1 className="mb-4 self-center px-4 text-center text-xl font-light md:mb-8">
          <a href={haiku.articleUrl}>{haiku.articleTitle}</a>
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="mb-2 max-w-[430px] self-center">
            <HaikuCard japaneseHaiku={haiku.senryu} />
          </div>
          <div className="flex flex-col items-start justify-start">
            <div className="mb-2">
              <h2 className="font-semibold">Reading</h2>
              {haiku.reading.split("\n").map((readingLine, index) => (
                <p className="ml-4" key={`readingLine-${index}`}>
                  {readingLine}
                </p>
              ))}
            </div>
            <div className="mb-2">
              <h2 className="font-semibold">Translation</h2>
              {haiku.en.split("\n").map((enLine, index) => (
                <p className="ml-4" key={`enLine-${index}`}>
                  {enLine}
                </p>
              ))}
            </div>
            <div className="mb-2">
              <h2 className="font-semibold">Topic</h2>
              <p className="ml-4">{haiku.topic}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <BackButton />
        </div>
      </section>
    </main>
  );
}
