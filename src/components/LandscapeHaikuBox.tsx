"use client";

import type { Haiku } from "@/utils/types";
import dayjs from "dayjs";
import Link from "next/link";
import { sa_deleteHaiku } from "@/app/myHaikus/actions";
import { useRouter } from "next/navigation";

export const LandscapeHaikuBox = ({ haikuData }: { haikuData: Haiku }) => {
  const router = useRouter();

  const delButtonHandler = () => {
    sa_deleteHaiku(haikuData.id)
      .then((res) => {
        if (res?.error) {
          console.error(res.error);
          return;
        }
        router.refresh();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div
      className={`m-2 flex h-[80px] w-full items-baseline justify-start rounded-lg  bg-gradient-to-tl  from-orange-200 to-orange-300 p-2 shadow-md dark:from-blue-900 dark:to-blue-700`}
    >
      <div className="mx-2 p-2 text-center shadow-sm ">
        {dayjs(haikuData.date).format("DD-MMM-YY")}
      </div>
      <Link href={`/detail/${haikuData.id}`} className="mr-2 flex flex-col">
        <div>{haikuData.senryu}</div>
        <div className="truncate">{haikuData.articleTitle}</div>
      </Link>
      <div className="flex-grow"></div>
      <div
        className="mx-4 self-center rounded-lg bg-orange-500 px-4 py-2 dark:bg-blue-800"
        onClick={delButtonHandler}
      >
        Del
      </div>
    </div>
  );
};
