"use client";

import { useState } from "react";
import type { NewsItem } from "@/utils/news";
import GenerateDialog from "./GenerateDialog";

export default function NewsItemCard({ newsItem }: { newsItem: NewsItem }) {
  const [isGenerateVisible, setIsGenerateVisible] = useState(false);

  return (
    <>
      <div
        className="mb-2 rounded-sm bg-orange-200 p-4 dark:bg-blue-900"
        onClick={() => {
          setIsGenerateVisible(true);
        }}
      >
        {newsItem.webTitle}
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
