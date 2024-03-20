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
  fetchHaikuCountFromFirebase,
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

/**
 * Haiku List generation process:
 * 1. Fetch the latest news
 * 2. Extract the topics from the news titles
 * 3. Generate haikus from the topics
 * @returns {Promise<Haiku[]>} The list of haikus generated
 */
async function generateAllHaikus(date: Date) {
  const latestNews = await getNews();
  console.log(
    `generateAllHaikus - Output of News Download:\n ${JSON.stringify(latestNews)}`,
  );

  const topics = await extractTopicFromTitles(
    latestNews.map((news) => news.webTitle),
  );
  topics.sort((a, b) => b.classification - a.classification);
  console.log(`generateAllHaikus - Today's topics: ${JSON.stringify(topics)}`);

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
  // TODO -> Change the order of the topics generated

  let haikus = await Promise.all(
    newsWithTopics.slice(0, 3).map((news) => generateHaiku(news.topic)),
  );
  // TEMPORARY EXPERIMENT: Generate haikus from the news titles instead of the topics
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

  return EnrichedHaikusList;
}

/**
 * Fetches today's haikus from the database if they were already generated
 * If not, will generate today's haikus and store them in the database
 * @param date the date for which we want to generate the haikus
 * @returns {Promise<Haiku[]>} The list of haikus generated
 */
export async function getOrCreateHaikus(date: Date) {
  await loginToFirebase();

  const todayHaikus = await fetchHaikusFromFirebase(date);
  if (todayHaikus.length > 0) {
    console.log(`getOrCreateHaikus: Today's haikus were already generated`);
    console.log(
      `getOrCreateHaikus - Today's haikus:\n ${todayHaikus.map((haiku) => haiku.articleTitle).join("\n")}`,
    );
    return todayHaikus;
  }

  console.log(
    `getOrCreateHaikus: Today's haikus were not generated yet, generating...`,
  );
  const enrichedHaikusList = await generateAllHaikus(date);
  // Now we have to store the haikus in the database, and return them
  const haikuWithIdList = await storeHaikusInFirebase(enrichedHaikusList);

  return haikuWithIdList.filter((haiku) => !!haiku);
}

/**
 * Check if haikus for a specific date were generated. If not, generates them.
 * This method doesn't return the actual haiku list, so it will prevent excessive data transfer
 * out of firebase in the case the API route is called too much.
 * @param date the date for which we want to generate the haikus
 */
export async function generateHaikusIfNeeded(date: Date) {
  await loginToFirebase();

  const todayHaikuCount = await fetchHaikuCountFromFirebase(date);
  if (todayHaikuCount > 0) {
    console.log(
      `GenerateHaikusIfNeeded - Today's haikus were already generated`,
    );
    return;
  }
  // If we didn't generate the haikus yet, we will generate them
  console.log(
    `GenerateHaikusIfNeeded - Today's haikus were not generated yet, generating...`,
  );
  const enrichedHaikusList = await generateAllHaikus(date);
  // Now we have to store the haikus in the database, and return them
  const haikuWithIdList = await storeHaikusInFirebase(enrichedHaikusList);
  return;
}

export default getOrCreateHaikus;
