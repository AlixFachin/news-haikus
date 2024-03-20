import { HaikuContainer } from "@/components/HaikuContainer";
import { getOrCreateHaikus } from "@/utils/main";
import dayjs from "dayjs";

// Setting the page revalidation cache options
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = 0;

export default async function Home() {
  const haikuList = await getOrCreateHaikus(dayjs().toDate());

  return (
    <main className="flex min-h-screen flex-col flex-wrap items-center justify-evenly sm:p-4 xl:p-24">
      <h1 className="mb-4 text-4xl font-bold sm:text-6xl md:mb-8">
        Today&apos;s Haikus
      </h1>
      <section>
        {<HaikuContainer haikuList={haikuList.filter((haiku) => !!haiku)} />}
      </section>
    </main>
  );
}
