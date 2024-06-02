"use client";
import type { NewsItem } from "@/utils/news";
import { sa_generateHaiku, sa_saveHaikuInDB } from "./actions";
import { useState } from "react";
import { useTransition } from "react";
import SmallHaikuCard from "./SmallHaikuCard";
import Spinner from "@/components/Spinner";
import type { Haiku } from "@/utils/types";
import { GenParamForm } from "./ParamForm";
import type { GenHaikuParameters } from "@/utils/types";
import { getTodayDateFormatJapanTime } from "@/utils/datetimeUtils";

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
  const [isSavingHaiku, setIsSavingHaiku] = useState(false);

  const handleGenHaikuClick = async (options: GenHaikuParameters) => {
    clearHaiku();
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

  const saveHaiku: (haiku: Omit<Haiku, "id" | "userId">) => void = async (
    haiku,
  ) => {
    setIsSavingHaiku(true);
    sa_saveHaikuInDB(haiku)
      .then((savedHaiku) => {
        if (!savedHaiku || "error" in savedHaiku) {
          setHaikuError(
            `Error saving haiku : ${savedHaiku?.error || "Unknown error"}`,
          );
          return;
        }
        setHaikuText("");
        setHaikuError("");
      })
      .catch((error) => {
        setHaikuError(`Error saving haiku : ${error || "Unknown error"}`);
      })
      .finally(() => setIsSavingHaiku(false));
  };

  return (
    <section className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="flex min-h-[500px] w-3/4  max-w-3xl flex-col items-start justify-evenly rounded-lg bg-orange-200 p-4 dark:bg-blue-800">
        <h1 className="mb-2 text-xl font-bold">
          Generate a Haiku from a news Item
        </h1>
        <h2>
          <span className="font-bold">Article Title</span>: {newsItem.webTitle}
        </h2>
        <div className="mb-2 grid grid-cols-1 gap-2 self-center sm:grid-cols-2">
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
          <div className="flex flex-col items-center justify-center">
            {(genPending || isSavingHaiku) && <Spinner />}
            {haikuError && <p className="text-orange-700">{haikuError}</p>}
            {!haikuError && haikuText != "" && (
              <SmallHaikuCard
                haiku={{
                  senryu: haikuText,
                  reading: haikuReading,
                  en: haikuEn,
                  date: getTodayDateFormatJapanTime(),
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
