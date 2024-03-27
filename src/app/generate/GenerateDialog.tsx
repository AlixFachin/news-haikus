"use client";
import type { NewsItem } from "@/utils/news";
import { sa_generateHaiku } from "./actions";
import { useState } from "react";
import { set } from "firebase/database";

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

  const handleGenHaikuClick = async (topic: string) => {
    const haiku = await sa_generateHaiku({ topic });
    if (!haiku || "error" in haiku) {
      setHaikuError(haiku.error);
      return;
    }

    if (haiku && !("error" in haiku)) {
      setHaikuText(haiku.senryu);
      setHaikuError("");
    }
  };

  return (
    <section className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="flex h-[400px] w-[600px] flex-col items-start justify-evenly rounded-lg bg-orange-200 p-4 dark:bg-blue-800">
        <h1 className="mb-2 text-lg">Generate a Haiku from a news Item</h1>
        <h2>Article Title: {newsItem.webTitle}</h2>
        <div className="mb-2 grid grid-cols-1 md:grid-cols-2">
          <div className="mr-4 flex flex-col p-2">
            <label>Temperature:</label>
            <input type="number" />
            <label>topK:</label>
            <input type="number" />
            <label>topP:</label>
            <input type="number" />
            <label>Prompt:</label>
            <input type="text" />
          </div>
          <div className="flex flex-col">
            <button
              className="rounded-lg bg-orange-400 p-2 text-lg shadow-sm dark:bg-blue-600"
              onClick={() => handleGenHaikuClick(newsItem.webTitle)}
            >
              Generate Haiku
            </button>
            {haikuError && <p className="text-orange-700">{haikuError}</p>}
            {!haikuError && (
              <>
                <h3>Haiku Result</h3>
                <div>
                  {haikuText.split("\n").map((line, index) => (
                    <p key={`haikuText-${index}`}>{line}</p>
                  ))}
                </div>
              </>
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
