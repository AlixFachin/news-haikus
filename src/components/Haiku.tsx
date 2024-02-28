import type { Haiku } from "@/utils/types";
import dayjs from "dayjs";

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
    <div className="m-4 flex w-[300px] flex-col items-start justify-start rounded-sm bg-yellow-300">
      <div className="l2r m-4 flex h-[400px]  flex-col items-start justify-evenly rounded-sm border-2 border-solid border-orange-800 p-4 text-4xl shadow-md">
        {haikuData.haiku.split("\n").map((line, index) => (
          <p className={getAlignment(index)} key={index}>
            {line}
          </p>
        ))}
      </div>
      <details>
        <summary>Details</summary>
        <ul>
          <li>{dayjs(haikuData.date).format("dd-MMM-YYYY")}</li>
          {haikuData.reading ? <li>{haikuData.reading}</li> : ""}
          {haikuData.en ? <li>{haikuData.en}</li> : ""}
        </ul>
      </details>
    </div>
  );
};
