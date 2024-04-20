import { HaikuBox } from "./HaikuBox";
import { getHaikusForDay } from "@/utils/main";

/**
 * This Component will display all the haikus for a given day passed in parameter
 * If there are no haikus for the day it will display a message
 */
export const DayHaikuContainer = async ({ haikuDate }: { haikuDate: Date }) => {
  const haikuList = await getHaikusForDay(haikuDate);

  if (haikuList.length === 0) {
    return (
      <section>
        <p>There are no haikus for this day!</p>
      </section>
    );
  }

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {haikuList
        .filter((haiku) => !!haiku)
        .map((haiku, index) => (
          <HaikuBox key={index} {...haiku} />
        ))}
    </div>
  );
};
