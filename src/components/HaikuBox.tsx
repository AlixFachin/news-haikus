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
      className={`m-4 flex w-[316px] flex-col items-start justify-start rounded-lg  bg-gradient-to-tl p-2 shadow-md dark:from-blue-900 dark:to-blue-700`}
    >
      <div className="w-full py-2 text-center">
        {dayjs(haikuData.date).format("DD-MMM-YY")}
      </div>
      <Link href={`/detail/${haikuData.id}`}>
        <HaikuCard japaneseHaiku={haikuData.senryu} />
      </Link>

      <details>
        <summary>Details</summary>
        <ul>
          <li>{dayjs(haikuData.date).format("DD-MMM-YYYY")}</li>
          {haikuData.reading ? <li>Reading: {haikuData.reading}</li> : ""}
          {haikuData.en ? <li>English: {haikuData.en}</li> : ""}
          <li>{haikuData.topic}</li>
          <li>{haikuData.articleTitle}</li>
        </ul>
      </details>
    </div>
  );
};
