"use client";

/**
 * This component will display some text, with the possibility to hide or show it.
 * Below the text a button will be displayed with a label corresponding to the title
 *
 */

import { useState } from "react";

type SummaryComponentProps = {
  title: string;
  children: React.ReactNode;
};

export function SummaryComponent({ title, children }: SummaryComponentProps) {
  const [showText, setShowText] = useState(true);

  if (!showText) {
    return (
      <button
        className="rounded-lg bg-orange-500 p-2 px-4 dark:bg-blue-800"
        onClick={() => setShowText(true)}
      >
        Show {title}
      </button>
    );
  }

  return (
    <div className="m-2 flex flex-col items-center justify-between rounded-lg bg-orange-200 p-4 md:m-4 dark:bg-blue-900">
      {children}
      <button
        className="rounded-lg bg-orange-500 p-2 px-4     dark:bg-blue-800"
        onClick={() => setShowText(false)}
      >
        Hide {title}
      </button>
    </div>
  );
}
