"use client";

import Link from "next/link";
import { useState } from "react";

export function HomeDisclaimer() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Default case: Just display the button
  if (!showDisclaimer) {
    return (
      <button
        className="rounded-lg bg-orange-500 p-2 px-4 text-xl dark:bg-blue-800"
        onClick={() => setShowDisclaimer(true)}
      >
        Show Disclaimer
      </button>
    );
  }
  // Non-default case: Display the whole disclaimer

  return (
    <div className="flex flex-col items-center justify-between rounded-lg bg-orange-200 p-4 dark:bg-blue-900">
      <p>
        This website is a hobby project, which generates haikus(*) based on some
        news of the day from <a href="www.theguardian.com">The Guardian</a>. The
        model is not perfect, and the haikus might not make sense. Please
        don&apos;t take them too seriously. <br /> I am not affiliated with The
        Guardian in any way, and the haikus do not reflect my personal opinion.{" "}
        <br />I have several features which prevent the haikus from being
        offensive, but I can&apos;t guarantee that they will always be
        inoffensive. If you find a haiku offensive, please contact me and I will
        remove it. If you want to learn more about the project, you can check
        the <Link href="/about">About page</Link>.
        <br />
        <span className="font-bold">Note:</span>Technically the poems on this
        page are not real haikus, as they do not refer to nature and/or seasons.
        They are closer to{" "}
        <a href="https://en.wikipedia.org/wiki/Senryū">senryu</a>, but I decided
        to call them haikus for simplicity.
      </p>
      <button
        className="rounded-lg bg-orange-500 p-2 px-4 text-xl dark:bg-blue-800"
        onClick={() => setShowDisclaimer(false)}
      >
        Hide Disclaimer
      </button>
    </div>
  );
}
