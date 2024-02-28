import zod from "zod";
import dayjs from "dayjs";

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

export const getNews = async () => {
  const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY;
  if (!GUARDIAN_API_KEY) {
    throw new Error("GUARDIAN_API_KEY is not set");
  }

  const sections: { id: string; q?: string }[] = [
    { id: "world", q: "japan, China, Thailand, Korea" },
    { id: "news", q: "japan" },
    { id: "lifeandstyle", q: "japan" },
    { id: "science" },
    { id: "arts" },
  ];

  const topics: {
    id: string;
    webTitle: string;
    sectionId?: string;
    webUrl: string;
  }[] = [];

  const query_url = new URL("https://content.guardianapis.com/search");

  // DATE FROM QUERY PARAMETER
  query_url.searchParams.append("api-key", GUARDIAN_API_KEY);
  const fromDate = dayjs().subtract(3, "day").format("YYYY-MM-DD");
  query_url.searchParams.append("from-date", fromDate);
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

    news.results.forEach((result) => topics.push(result));
  }

  return topics;
};
