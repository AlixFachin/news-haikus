import type { Haiku } from "@/utils/types";
import dayjs from "dayjs";
import { HaikuCard } from "./HaikuCard";
import Link from "next/link";

import { Sawarabi_Mincho } from "next/font/google";

const MinchoFont = Sawarabi_Mincho({
  weight: "400",
  subsets: ["latin-ext"],
});

export const HaikuBox = (haikuData: Haiku) => {
  return (
    <div
      className={`m-4 flex w-[316px] flex-col items-stretch justify-start rounded-lg  bg-gradient-to-tl  from-orange-200 to-orange-300 p-2 shadow-md dark:from-blue-900 dark:to-blue-700`}
    >
      <div className="mb-2 w-full py-2 text-center">
        {dayjs(haikuData.date).format("DD-MMM-YY")}
      </div>
      <Link href={`/detail/${haikuData.id}`} className="mb-2">
        <HaikuCard japaneseHaiku={haikuData.senryu} />
      </Link>

      <div className="flex-grow rounded-lg p-2 text-sm">
        {haikuData.articleTitle}
      </div>
    </div>
  );
};
