"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { NewsItem } from "@/utils/news";
import GenerateDialog from "./GenerateDialog";
import { Protect } from "@clerk/nextjs";
import { sa_deleteNewsFromFB } from "./actions";
import Spinner from "@/components/Spinner";
// Displays a box containing the news item's title and the link towards the news article.
// On click, it will display a dialog to generate a Haiku based on this news item.

export default function NewsItemCard({ newsItem }: { newsItem: NewsItem }) {
  const [isGenerateVisible, setIsGenerateVisible] = useState(false);
  const [deletionPending, startDeleteTransition] = useTransition();
  const router = useRouter();
  const handleDeleteNewsClick = () => {
    startDeleteTransition(async () => {
      const result = await sa_deleteNewsFromFB(newsItem.id);
      if (!result || "error" in result) {
        console.error(result?.error || "Unknown error in news deletion");
        return;
      }
      router.refresh();
    });
  };

  if (deletionPending) {
    return (
      <div className="mb-2 flex cursor-pointer items-baseline justify-start rounded-sm bg-orange-200 p-4 dark:bg-blue-900">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 flex cursor-pointer items-baseline justify-start rounded-sm bg-orange-200 p-4 dark:bg-blue-900">
        <div
          className="cursor-pointer"
          onClick={() => {
            setIsGenerateVisible(true);
          }}
        >
          {newsItem.webTitle}
        </div>
        <div className="flex-grow"></div>
        <div>
          <a className="ml-2 italic" href={newsItem.webUrl}>
            link
          </a>
        </div>
        <Protect role="org:admin">
          <div
            className="mx-4 rounded-lg bg-orange-500 px-4 py-2"
            onClick={handleDeleteNewsClick}
          >
            Del
          </div>
        </Protect>
      </div>
      {isGenerateVisible ? (
        <GenerateDialog
          newsItem={newsItem}
          hide={() => setIsGenerateVisible(false)}
        />
      ) : null}
    </>
  );
}
