import { HaikuBox } from "./HaikuBox";
import type { Haiku } from "@/utils/types";

export const HaikuContainer = async ({ haikuList }: { haikuList: Haiku[] }) => {
  return (
    <div className="grid max-w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {haikuList.map((haiku, index) => (
        <HaikuBox key={index} {...haiku} />
      ))}
    </div>
  );
};
