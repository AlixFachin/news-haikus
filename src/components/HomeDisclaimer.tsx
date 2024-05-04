"use client";

import Link from "next/link";
import { SummaryComponent } from "./SummaryComponent";

export function HomeDisclaimer() {
  return (
    <SummaryComponent title="Disclaimer">
      <p className="md:p-4">
        This website is a hobby project, which generates haikus(*) based on some
        news of the day from <a href="www.theguardian.com">The Guardian</a>. The
        model is not perfect, and the haikus might not make sense. Please
        don&apos;t take them too seriously. <br /> I am not affiliated with The
        Guardian in any way, and the haikus do not reflect my personal opinion.{" "}
        <br />
        Several features prevents the haikus from being offensive, but I
        can&apos;t guarantee that they will always be inoffensive. If you find a
        haiku offensive, please contact me and I will remove it. If you want to
        learn more about the project, you can check the{" "}
        <Link href="/about">About page</Link>.
        <br />
        <span className="font-bold">Note:</span>Technically the poems on this
        page are not real haikus, as they do not refer to nature and/or seasons.
        They are closer to{" "}
        <a href="https://en.wikipedia.org/wiki/Senryū">senryu</a>, but I decided
        to call them haikus for simplicity.
      </p>
      <p className="self-stretch md:p-4">
        You can see below the{" "}
        <span className="font-bold">Haikus of the Day</span>. If you want to
        play with the model and generate some haikus, you need to go to{" "}
        <span className="underline">
          <Link href="/generate">Generate Haikus</Link>
        </span>
        .
      </p>
    </SummaryComponent>
  );
}
