import { HaikuContainer } from "@/components/HaikuContainer";
import { getHaikus } from "@/utils/main";
import dayjs from "dayjs";

export default async function Home() {
  const haikuList = await getHaikus(dayjs().toDate());

  return (
    <main className="flex min-h-screen flex-col flex-wrap items-center justify-evenly sm:p-4 xl:p-24">
      <h1 className="text-4xl font-bold sm:text-6xl">Today&apos;s Haikus</h1>
      <section>
        {<HaikuContainer haikuList={haikuList.filter((haiku) => !!haiku)} />}
      </section>
    </main>
  );
}
