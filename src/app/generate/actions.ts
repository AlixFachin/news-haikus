"use server";

import { getNews } from "@/utils/news";
import { extractTopicFromTitles } from "@/utils/NewsClassifier";

export async function fetchNews() {
  const topicsList = await getNews();
  return topicsList;
}
