import { HaikuBox } from "./HaikuBox";
import getOrCreateHaikus from "@/utils/main";

const COUNT_HAIKU_GENERATED_DURING_BUILD = 5;

/**
 * This Component will display all the haikus for a given day passed in parameter
 * If there are no haikus for the day, it will either generate the haikus or display a message
 * according to the parameter
 * @param shouldGenerate - If true, it will generate the haikus if there are none
 * @returns
 */
export const DayHaikuContainer = async ({
  shouldGenerate,
  haikuDate,
}: {
  shouldGenerate: boolean;
  haikuDate: Date;
}) => {
  const haikuList = await getOrCreateHaikus(
    haikuDate,
    shouldGenerate,
    COUNT_HAIKU_GENERATED_DURING_BUILD,
  );

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
