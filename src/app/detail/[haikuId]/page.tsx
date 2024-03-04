import { HaikuCard } from "@/components/HaikuCard";
import {
  getAllHaikuIdsFromFirebase,
  fetchOneHaikuFromFirebase,
} from "@/utils/firebase";
import { notFound } from "next/navigation";
import dayjs from "dayjs";

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

  return (
    <main className=" min-h-screen sm:p-4 xl:p-24">
      <h1 className="text-xl font-bold">{haiku.topic}</h1>
      <section className="w-[400px] bg-gradient-to-br from-orange-500 to-yellow-600 p-4">
        <HaikuCard japaneseHaiku={haiku.senryu} />
        <ul>
          <li>{dayjs(haiku.date).format("DD-MMM-YY")}</li>
          <li>
            The original article title is:{" "}
            <a href={haiku.articleUrl}>{haiku.articleTitle}</a>
          </li>
          <li>English Reading: {haiku.reading}</li>
          <li>English Translation: {haiku.en}</li>
        </ul>
      </section>
    </main>
  );
}
