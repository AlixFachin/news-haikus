import zod from "zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

import { getNewsFromFirebase, storeNewsInFirebase } from "./firebase";

import { getDateFormatJapanTimeFromDayjs } from "./datetimeUtils";

const newsSchema = zod.object({
  total: zod.number(),
  startIndex: zod.number(),
  pageSize: zod.number(),
  currentPage: zod.number(),
  pages: zod.number(),
  results: zod.array(
    zod.object({
      id: zod.string(),
      sectionId: zod.string().optional(),
      webTitle: zod.string(),
      webUrl: zod.string(),
      pillarId: zod.string().optional(),
    }),
  ),
});

export type newsSchemaType = zod.infer<typeof newsSchema>;
export type NewsItem = newsSchemaType["results"][number];

export const getNewsFromAPI = async () => {
  const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
  if (!GUARDIAN_API_KEY) {
    throw new Error("GUARDIAN_API_KEY is not set");
  }

  const sections: { id: string; q?: string }[] = [
    { id: "world", q: "japan, China, Thailand, Korea" },
    { id: "news", q: "japan" },
    { id: "lifeandstyle" },
    { id: "science" },
    { id: "arts" },
  ];

  const topics: {
    id: string;
    webTitle: string;
    sectionId?: string;
    webUrl: string;
    date: string;
  }[] = [];

  const query_url = new URL("https://content.guardianapis.com/search");

  // DATE FROM QUERY PARAMETER
  query_url.searchParams.append("api-key", GUARDIAN_API_KEY);
  const currentDate = dayjs();

  query_url.searchParams.append(
    "from-date",
    currentDate.subtract(1, "day").tz("Asia/Tokyo").format("YYYY-MM-DD"),
  );
  query_url.searchParams.append("order-by", "newest");

  for (const section of sections) {
    if (query_url.searchParams.has("q")) {
      query_url.searchParams.delete("q");
    }
    if (query_url.searchParams.has("section")) {
      query_url.searchParams.delete("section");
    }

    query_url.searchParams.append("section", section.id);
    if (section.q) {
      query_url.searchParams.append("q", section.q);
    }
    const response = await fetch(query_url);
    if (response.status !== 200) {
      throw new Error("Failed to fetch news");
    }
    const responseJSON = await response.json();
    const news = newsSchema.parse(responseJSON.response);

    news.results.forEach((result) =>
      topics.push({
        ...result,
        date: getDateFormatJapanTimeFromDayjs(currentDate),
      }),
    );
  }

  await storeNewsInFirebase(topics);

  return topics;
};

/**
 * get the news for today. Checks if the news are already in the database, in such case
 * it returns the DB content. If the DB is empty, it will download the news from the API
 * @returns list of article information
 */
export const getNews = async () => {
  const todayDate = dayjs();
  const newsInDB = await getNewsFromFirebase(todayDate.toDate());
  if (newsInDB.length > 0) {
    console.log(
      `getNews: News already inside the DB, no need to download from API!`,
    );
    return newsInDB;
  }
  // (no need for await as we are already inside a promise)
  return getNewsFromAPI();
};