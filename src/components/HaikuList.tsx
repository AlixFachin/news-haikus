import type { Haiku } from "@/utils/types";
import { HaikuBox } from "./HaikuBox";
import { LandscapeHaikuBox } from "./LandscapeHaikuBox";

/**
 * Returns a component which displays "nicely" the list of haikus
 * props are:
 * Haikus: a list of haikus to be displayed
 * orientation: If "Grid" will display each Haiku in a grid with each haiku's Japanese displayed in a portrait card.
 * If "List" will display each Haiku in a small list with a small amount of text.
 */
export default function HaikuList({
  haikus,
  orientation,
}: {
  haikus: Haiku[];
  orientation: "Grid" | "List";
}) {
  if (haikus.length === 0) {
    return (
      <section>
        <p>There are no haikus for this day!</p>
      </section>
    );
  }

  if (orientation === "Grid") {
    return (
      <div className="grid max-w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {haikus
          .filter((haiku) => !!haiku)
          .map((haiku, index) => (
            <HaikuBox key={index} {...haiku} />
          ))}
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center">
      {haikus
        .filter((haiku) => !!haiku)
        .map((haiku, index) => (
          <LandscapeHaikuBox key={`haiku-${index}`} haikuData={haiku} />
        ))}
    </section>
  );
}
