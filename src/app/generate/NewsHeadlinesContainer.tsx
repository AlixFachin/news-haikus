import { getNewsFromFirebase } from "@/utils/firebase";
import NewsItemCard from "./NewsItemCard";
import dayjs from "dayjs";

export const NewsHeadlinesContainer = async () => {
  const newsInDB = await getNewsFromFirebase(dayjs().toDate());

  if (newsInDB.length === 0) {
    return <p>No news were saved for this day!</p>;
  }

  return (
    <section className="p-4">
      {newsInDB.map((newsItem, index) => (
        <NewsItemCard key={`newsItem-${index}`} newsItem={newsItem} />
      ))}
    </section>
  );
};
