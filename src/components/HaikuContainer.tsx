import { Haiku } from "./Haiku";

const haikus = [
  "人々を\nしぐれよ宿は\n寒くとも",
  "初雪や\n聖小僧が\n笈の色",
  "こがらしや\n頬腫痛む\n人の顔",
];

export const HaikuContainer = async () => {
  //   const haikuText = await generateHaiku("office romance");

  return (
    <div>
      <div className="flex justify-start align-top">
        {haikus.map((haiku, index) => (
          <Haiku key={index} haiku={haiku} />
        ))}
      </div>
      {/* <div className="border-red rounded-sm border-2 border-solid p-4">
        {haikuText}
      </div> */}
    </div>
  );
};
