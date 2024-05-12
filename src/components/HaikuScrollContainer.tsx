"use client";
import HaikuList from "./HaikuList";
import type { Haiku } from "@/utils/types";
import { useEffect, useState, useRef, useCallback } from "react";
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
  const [hasMoreHaikus, setHasMoreHaikus] = useState(true);
  const observerTarget = useRef(null);

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

  const loadMoreHaikus = useCallback(() => {
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
      if (haikus.length === 0) {
        setHasMoreHaikus(false);
      }
      // concat method returns a new array so it will trigger a re-render
      setHaikuList(haikuList.concat(haikus));
    });
  }, [haikuList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreHaikus) {
          loadMoreHaikus();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    const component = observerTarget.current;

    return () => {
      if (component) {
        observer.unobserve(component);
      }
    };
  }, [observerTarget, loadMoreHaikus, hasMoreHaikus]);

  return (
    <section className="flex w-full flex-col items-center">
      <HaikuList haikus={haikuList} orientation="Grid" />
      {isLoading && <Spinner />}
      <div ref={observerTarget}></div>
    </section>
  );
}
