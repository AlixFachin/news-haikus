export const HaikuCard = ({ japaneseHaiku }: { japaneseHaiku: string }) => {
  const getAlignment = (index: number) => {
    if (index === 0) {
      return "self-start";
    } else if (index === 1) {
      return "self-center";
    }
    return "self-end";
  };

  return (
    <div className="flex h-[400px] w-[300px] items-stretch justify-stretch backdrop-blur-md">
      <div
        className={
          "r2l box-border flex h-full w-full flex-col justify-evenly rounded-sm  p-4 text-4xl shadow-md"
        }
      >
        {japaneseHaiku.split("\n").map((line, index) => (
          <p className={getAlignment(index)} key={index}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};
