"use client";
import type { NewsItem } from "@/utils/news";
import { sa_generateHaiku, sa_saveHaikuInDB } from "./actions";
import { useState } from "react";
import { useTransition } from "react";
import SmallHaikuCard from "./SmallHaikuCard";
import dayjs from "dayjs";
import Spinner from "@/components/Spinner";
import type { Haiku } from "@/utils/types";
import { GenParamForm } from "./ParamForm";
import type { GenHaikuParameters } from "@/utils/types";

export default function GenerateDialog({
  newsItem,
  hide,
}: {
  newsItem: NewsItem;
  hide: () => void;
}) {
  const [haikuText, setHaikuText] = useState<string>("");
  const [haikuReading, setHaikuReading] = useState<string>("");
  const [haikuEn, setHaikuEn] = useState<string>("");
  const [haikuError, setHaikuError] = useState<string>("");
  const [genPending, startGenTransition] = useTransition();
  const [savePending, startSaveTransition] = useTransition();

  const handleGenHaikuClick = async (options: GenHaikuParameters) => {
    // We will use a Transition to show a spinner while the haiku is being generated
    startGenTransition(async () => {
      const haiku = await sa_generateHaiku(options);
      if (!haiku || "error" in haiku) {
        setHaikuError(haiku?.error);
        return;
      }

      if (haiku && !("error" in haiku)) {
        setHaikuText(haiku.senryu);
        setHaikuReading(haiku.reading);
        setHaikuEn(haiku.en);
        setHaikuError("");
      }
    });
  };

  const clearHaiku = () => {
    setHaikuText("");
    setHaikuReading("");
    setHaikuEn("");
    setHaikuError("");
  };

  const saveHaiku: (haiku: Omit<Haiku, "id">) => Promise<void> = async (
    haiku,
  ) => {
    startSaveTransition(async () => {
      const savedHaiku = await sa_saveHaikuInDB(haiku);
      if (!savedHaiku || "error" in savedHaiku) {
        setHaikuError(
          `Error saving haiku : ${savedHaiku?.error || "Unknown error"}`,
        );
        return;
      }
      setHaikuText("");
      setHaikuError("");
    });
  };

  return (
    <section className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="flex h-[500px] w-[600px] flex-col items-start justify-evenly rounded-lg bg-orange-200 p-4 dark:bg-blue-800">
        <h1 className="mb-2 text-xl font-bold">
          Generate a Haiku from a news Item
        </h1>
        <h2>
          <span className="font-bold">Article Title</span>: {newsItem.webTitle}
        </h2>
        <div className="mb-2 grid grid-cols-1 md:grid-cols-2">
          <GenParamForm
            handleGenHaikuClick={(options) =>
              handleGenHaikuClick({
                topic: newsItem.webTitle,
                topK: options.topK,
                topP: options.topP,
                temperature: options.temperature,
              })
            }
          />
          <div className="flex h-full w-full flex-col items-center justify-center">
            {genPending && <Spinner />}
            {haikuError && <p className="text-orange-700">{haikuError}</p>}
            {!haikuError && haikuText != "" && (
              <SmallHaikuCard
                haiku={{
                  senryu: haikuText,
                  reading: haikuReading,
                  en: haikuEn,
                  date: dayjs().format("YYYYMMDD"),
                  classification: 5,
                  topic: newsItem.webTitle,
                  articleTitle: newsItem.webTitle,
                  articleUrl: newsItem.webUrl,
                }}
                clearHaiku={clearHaiku}
                saveHaiku={saveHaiku}
              />
            )}
          </div>
        </div>
        <button
          className="self-center rounded-lg bg-orange-400 p-2 text-lg shadow-sm dark:bg-blue-600"
          onClick={hide}
        >
          Back
        </button>
      </div>
    </section>
  );
}
