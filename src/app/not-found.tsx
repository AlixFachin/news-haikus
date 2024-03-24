import { HaikuCard } from "@/components/HaikuCard";
import Link from "next/link";

const lost_haiku = {
  haiku: "ページが消え\nリンクは虚空へ\n404です",
  reading: "peiji ga kie\n rinku wa kokuu e\n 404 desu",
  en: "The page is gone\nThe link leads to the void\n404 error",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly sm:p-4 xl:p-24">
      <section className="flex max-w-[850px] flex-col items-start justify-start rounded-xl bg-gradient-to-br from-orange-200 to-orange-300 p-4 dark:from-blue-900 dark:to-blue-700">
        <h1 className="mb-4 self-center px-4 text-center text-xl font-light md:mb-8">
          404 Page: Woops!
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="mb-2 max-w-[430px] self-center">
            <HaikuCard japaneseHaiku={lost_haiku.haiku} />
          </div>
          <div className="flex flex-col items-start justify-start">
            <div className="mb-2">
              <h2 className="font-semibold">Reading</h2>
              {lost_haiku.reading.split("\n").map((readingLine, index) => (
                <p className="ml-4" key={`readingLine-${index}`}>
                  {readingLine}
                </p>
              ))}
            </div>
            <div className="mb-2">
              <h2 className="font-semibold">Translation</h2>
              {lost_haiku.en.split("\n").map((enLine, index) => (
                <p className="ml-4" key={`enLine-${index}`}>
                  {enLine}
                </p>
              ))}
            </div>
          </div>
        </div>
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
