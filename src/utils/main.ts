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
import { getDateFormatJapanTime } from "./datetimeUtils";

type NewsWithTopic = Awaited<ReturnType<typeof getNews>>[number] &
  Omit<Awaited<ReturnType<typeof extractTopicFromTitles>>[number], "title">;

type RawHaiku = Awaited<ReturnType<typeof generateHaiku>>;

/**
 * Function will return an array containing the first n numbers shuffled in a random way
 * @param length desired length of the array
 * @returns array containing the first n numbers shuffled in a random way
 */
function getRandomArray(length: number) {
  const index_array = [];
  for (let i = 0; i < length; i++) {
    index_array.push({
      index: i,
      pivot: Math.floor(Math.random() * length * 2),
    });
  }
  index_array.sort((a, b) => a.pivot - b.pivot);

  return index_array.map((element) => element.index);
}

/**
 * Haiku List generation process:
 * 1. Fetch the latest news
 * 2. Extract the topics from the news titles
 * 3. Generate haikus from the topics
 * @param date the date for which we want to generate the haikus
 * @param count the number of haikus to generate
 * @returns {Promise<Omit<Haiku, "id" | "userId">[]>} The list of haikus generated
 */
async function generateHaikuList(date: Date, count: number) {
  const latestNews = await getNews();
  console.log(
    `generateAllHaikus - Output of News Download:\n ${JSON.stringify(latestNews)}`,
  );

  const indexList = getRandomArray(latestNews.length);

  const haikuList = await indexList.reduce(
    (currentPromise, index) =>
      currentPromise.then((currentHaikuList) => {
        if (currentHaikuList.length >= count) {
          return currentHaikuList;
        }
        const news = latestNews[indexList[index]];
        return generateHaiku({ topic: news.webTitle }).then((haiku) => {
          if (haiku) {
            return [...currentHaikuList, haiku];
          }
          return currentHaikuList;
        });
      }),
    Promise.resolve<RawHaiku[]>([]),
  );

  const EnrichedHaikusList: Omit<Haiku, "id" | "userId">[] = [];

  haikuList.forEach((haiku) => {
    if (haiku) {
      const correspondingNews = latestNews.find(
        (news) => haiku.topic === news.webTitle,
      );
      if (correspondingNews) {
        EnrichedHaikusList.push({
          ...haiku,
          date: getDateFormatJapanTime(date),
          classification: 0,
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
export async function getHaikusForDay(date: Date) {
  await loginToFirebase();

  const todayHaikus = await fetchHaikusFromFirebase(date, "system");
  console.log(
    `getOrCreateHaikus: Checking haiku DB State for ${date.toISOString()}`,
  );
  return todayHaikus;
}

/**
 * Generate one Haiku for a specific date, if the system didn't generate it yet
 * @param date the date for which we want to generate the haiku
 */
export async function generateOneHaikuFromDate(date: Date) {
  await loginToFirebase();
  const NB_SYSTEM_HAIKUS_PER_DAY = process.env.NB_SYSTEM_HAIKUS_PER_DAY
    ? Number(process.env.NB_SYSTEM_HAIKUS_PER_DAY)
    : 3;

  const todayHaikuCount = await fetchHaikuCountFromFirebase(date, "system");
  if (todayHaikuCount >= NB_SYSTEM_HAIKUS_PER_DAY) {
    console.log(
      `GenerateOneHaikuForDate ${date.toLocaleString()} - exiting as ${todayHaikuCount} haikus were already generated`,
    );
    return;
  }

  console.log(
    `GenerateOneHaikuForDate ${date.toLocaleString()} - generating one haiku...`,
  );

  const enrichedHaikusList = await generateHaikuList(date, 1);
  await storeHaikusInFirebase(
    enrichedHaikusList.map((haikuWithoutUserID) => ({
      ...haikuWithoutUserID,
      userId: "system",
    })),
  );
  return;
}
