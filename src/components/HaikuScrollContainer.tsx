"use client";
import HaikuList from "./HaikuList";
import type { Haiku } from "@/utils/types";
import { useEffect, useState } from "react";
import { sa_fetchHaikus } from "@/app/actions";
import Spinner from "./Spinner";

/**
 * Client component, which will download and maintain a list of haikus and add a infinite scroll
 *
 */
export default function HaikuScrollContainer() {
  // The haikuList will contain the list of haikus, sorted in DESC order
  const [haikuList, setHaikuList] = useState<Haiku[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    sa_fetchHaikus(undefined).then((haikus) => {
      setIsLoading(false);
      if ("error" in haikus) {
        // TODO: Add a toast here to display the error
        console.error(haikus.error);
        return;
      }
      setHaikuList(haikus);
    });
  }, []);

  const loadMoreHaikus = () => {
    if (haikuList.length === 0) {
      setIsLoading(true);
      sa_fetchHaikus(undefined).then((haikus) => {
        setIsLoading(false);
        if ("error" in haikus) {
          // TODO: Add a toast here to display the error
          console.error(haikus.error);
          return;
        }
        setHaikuList(haikus);
      });
      return;
    }

    // Load the first batch of haikus on initial re-render

    const lastHaiku = haikuList[haikuList.length - 1];
    setIsLoading(true);
    sa_fetchHaikus(lastHaiku.id).then((haikus) => {
      setIsLoading(false);
      if ("error" in haikus) {
        console.error(haikus.error);
        return;
      }
      // concat method returns a new array so it will trigger a re-render
      setHaikuList(haikuList.concat(haikus));
    });
  };

  return (
    <section className="flex w-full flex-col items-center">
      <HaikuList haikus={haikuList} orientation="Grid" />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="my-4 flex w-full items-center justify-center rounded-lg bg-orange-200 p-4 dark:bg-blue-900">
          <button
            className="rounded-lg bg-orange-500 p-2 shadow-sm md:p-4 dark:bg-blue-500"
            onClick={loadMoreHaikus}
          >
            Display More Haikus
          </button>
        </div>
      )}
    </section>
  );
}
