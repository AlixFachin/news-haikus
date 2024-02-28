import { HaikuBox } from "./Haiku";
import type { Haiku } from "@/utils/types";

export const HaikuContainer = async ({ haikuList }: { haikuList: Haiku[] }) => {
  return (
    <div className="grid max-w-full grid-cols-3 gap-4">
      {haikuList.map((haiku, index) => (
        <HaikuBox key={index} {...haiku} />
      ))}
    </div>
  );
};
