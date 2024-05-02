import {
  getLatestNewsFromFirebase,
  getNewsFromFirebase,
} from "@/utils/firebase";
import NewsItemCard from "./NewsItemCard";
import dayjs from "dayjs";

export const NewsHeadlinesContainer = async () => {
  const newsInDB = await getLatestNewsFromFirebase(dayjs(), 20);

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
