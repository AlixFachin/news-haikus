/**
 * Daily process to download or generate haikus based on recent news
 *
 * 1. Logs in to Firebase
 * 2. Tries to fetch today's haikus if they were already generated
 * 3. If not, will generate today's haikus with:
 * 3.a. Fetching the latest news
 * 3.b. Extracting the topics from the news titles
 * 3.c. Generating haikus from the topics
 * 3.d. Storing the haikus in the database
 * 4. Return today's haikus
 */

import dayjs from "dayjs";
import {
  fetchHaikusFromFirebase,
  loginToFirebase,
  storeHaikusInFirebase,
} from "./firebase";
import generateHaiku from "./haikuGenerator";
import { getNews } from "./news";
import { extractTopicFromTitles } from "./NewsClassifier";
import type { Haiku } from "./types";

type NewsWithTopic = Awaited<ReturnType<typeof getNews>>[number] &
  Omit<Awaited<ReturnType<typeof extractTopicFromTitles>>[number], "title">;

export async function getHaikus(date: Date) {
  await loginToFirebase();

  const todayHaikus = await fetchHaikusFromFirebase(date);
  if (todayHaikus.length > 0) {
    console.log(`Today's haikus were already generated`);
    console.log(
      `Today's haikus: ${todayHaikus.map((haiku) => JSON.stringify(haiku))}`,
    );
    return todayHaikus;
  }

  console.log(`Today's haikus were not generated yet, generating...`);

  const latestNews = await getNews();
  console.log(`Latest news: ${JSON.stringify(latestNews)}`);

  const topics = await extractTopicFromTitles(
    latestNews.map((news) => news.webTitle),
  );
  topics.sort((a, b) => b.classification - a.classification);
  console.log(`Today's topics: ${JSON.stringify(topics)}`);

  const newsWithTopics: NewsWithTopic[] = [];
  topics.forEach((topic) => {
    const relatedNews = latestNews.find(
      (news) => news.webTitle === topic.title,
    );
    if (relatedNews) {
      newsWithTopics.push({
        ...relatedNews,
        topic: topic.topic,
        classification: topic.classification,
      });
    }
  });

  // For now let's generate haikus with the top 5 topics.
  // After a while we will find a better way to generate haikus
  // (e.g. top 3 plus random 2 in the remaining 7?)
  // and check that the article was not already used in a previous day

  let haikus = await Promise.all(
    newsWithTopics.slice(0, 3).map((news) => generateHaiku(news.topic)),
  );
  haikus = [
    ...haikus,
    ...(await Promise.all(
      newsWithTopics.slice(0, 3).map((news) => generateHaiku(news.webTitle)),
    )),
  ];

  const EnrichedHaikusList: Omit<Haiku, "id">[] = [];

  haikus.forEach((haiku) => {
    if (haiku) {
      const correspondingNews = newsWithTopics.find(
        (news) => haiku.topic === news.topic || haiku.topic === news.webTitle,
      );
      if (correspondingNews) {
        EnrichedHaikusList.push({
          ...haiku,
          date: dayjs(date).format("YYYYMMDD"),
          classification: correspondingNews.classification,
          articleTitle: correspondingNews.webTitle,
          articleUrl: correspondingNews.webUrl,
        });
      }
    }
  });

  // Now we have to store the haikus in the database, and return them
  const haikuWithIdList = await storeHaikusInFirebase(EnrichedHaikusList);

  return haikuWithIdList.filter((haiku) => !!haiku);
}

export default getHaikus;
