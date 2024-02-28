import type { Haiku } from "@/utils/types";
import dayjs from "dayjs";

import { Sawarabi_Mincho } from "next/font/google";

const MinchoFont = Sawarabi_Mincho({
  weight: "400",
  subsets: ["latin-ext"],
});

export const HaikuBox = (haikuData: Haiku) => {
  const getAlignment = (index: number) => {
    if (index === 0) {
      return "self-start";
    } else if (index === 1) {
      return "self-center";
    }
    return "self-end";
  };

  return (
    <a href={haikuData.articleUrl}>
      <div
        className={`m-4 flex w-[316px] flex-col items-start justify-start rounded-lg  bg-gradient-to-tl p-2 shadow-md dark:from-blue-900 dark:to-blue-700`}
      >
        <div className="w-full py-2 text-center">
          {dayjs(haikuData.date).format("DD-MMM-YY")}
        </div>
        <div className="flex h-[400px] w-[300px] items-stretch justify-stretch">
          <div
            className={
              "r2l box-border flex h-full w-full flex-col justify-evenly rounded-sm  p-4 text-4xl shadow-md"
            }
          >
            {haikuData.senryu.split("\n").map((line, index) => (
              <p className={getAlignment(index)} key={index}>
                {line}
              </p>
            ))}
          </div>
        </div>

        <details>
          <summary>Details</summary>
          <ul>
            <li>{dayjs(haikuData.date).format("dd-MMM-YYYY")}</li>
            {haikuData.reading ? <li>Reading: {haikuData.reading}</li> : ""}
            {haikuData.en ? <li>English: {haikuData.en}</li> : ""}
            <li>{haikuData.topic}</li>
          </ul>
        </details>
      </div>
    </a>
  );
};
