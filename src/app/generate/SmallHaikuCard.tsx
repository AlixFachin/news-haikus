"use client";

import { Haiku } from "@/utils/types";

export default function SmallHaikuCard({
  haiku,
  clearHaiku,
  saveHaiku,
}: {
  haiku: Omit<Haiku, "id">;
  clearHaiku: () => void;
  saveHaiku: (haiku: Omit<Haiku, "id">) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="self-start font-bold">Haiku</h3>
      <div className="mb-2 py-2">
        {haiku.senryu.split("\n").map((line, index) => (
          <p className="ml-2" key={`haikuText-${index}`}>
            {line}
          </p>
        ))}
      </div>
      <h3 className="self-start font-bold">Reading</h3>
      <div className="mb-2 py-2">
        {haiku.reading.split("\n").map((line, index) => (
          <p className="ml-2" key={`haikuRead-${index}`}>
            {line}
          </p>
        ))}
      </div>
      <div className="flex w-full justify-evenly">
        <button
          className="mr-2 rounded-lg bg-orange-400 px-2 shadow-sm dark:bg-blue-600"
          onClick={clearHaiku}
        >
          Clear
        </button>
        <button
          className="rounded-lg bg-orange-400 px-2 shadow-sm dark:bg-blue-600"
          onClick={() => saveHaiku(haiku)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
