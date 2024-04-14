"use client";

import { useState } from "react";
import type { NewsItem } from "@/utils/news";
import GenerateDialog from "./GenerateDialog";

// Displays a box containing the news item's title and the link towards the news article.
// On click, it will display a dialog to generate a Haiku based on this news item.

export default function NewsItemCard({ newsItem }: { newsItem: NewsItem }) {
  const [isGenerateVisible, setIsGenerateVisible] = useState(false);

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
