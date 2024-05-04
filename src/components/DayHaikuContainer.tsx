import { getHaikusForDay } from "@/utils/main";
import HaikuList from "./HaikuList";

/**
 * This Component will display all the haikus for a given day passed in parameter
 * If there are no haikus for the day it will display a message
 */
export const DayHaikuContainer = async ({ haikuDate }: { haikuDate: Date }) => {
  // This component is a wrapper around the async haiku download function, to
  // allow for the use of the Suspense component in the parent component
  const haikuList = await getHaikusForDay(haikuDate);
  return <HaikuList haikus={haikuList} orientation="Grid" />;
};
