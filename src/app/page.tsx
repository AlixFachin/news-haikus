import { HaikuContainer } from "@/components/HaikuContainer";
import { getHaikus } from "@/utils/main";
import dayjs from "dayjs";

export default async function Home() {
  const haikuList = await getHaikus(dayjs().toDate());

  return (
    <main className="flex min-h-screen flex-col flex-wrap items-center justify-evenly p-24">
      <h1 className="text-6xl font-bold">Today's Haikus</h1>
      <section>{<HaikuContainer haikuList={haikuList} />}</section>
    </main>
  );
}
