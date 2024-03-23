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
import { get } from "http";

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
 * @returns {Promise<Haiku[]>} The list of haikus generated
 */
async function generateHaikuList(date: Date, count: number) {
  //TODO: Extract the news download into its separate function + separate DB so that
  // the regularly times cron can be split into two functions.
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
        return generateHaiku(news.webTitle).then((haiku) => {
          if (haiku) {
            return [...currentHaikuList, haiku];
          }
          return currentHaikuList;
        });
      }),
    Promise.resolve<RawHaiku[]>([]),
  );

  const EnrichedHaikusList: Omit<Haiku, "id">[] = [];

  haikuList.forEach((haiku) => {
    if (haiku) {
      const correspondingNews = latestNews.find(
        (news) => haiku.topic === news.webTitle,
      );
      if (correspondingNews) {
        EnrichedHaikusList.push({
          ...haiku,
          date: dayjs(date).format("YYYYMMDD"),
          classification: 0,
          articleTitle: correspondingNews.webTitle,
          articleUrl: correspondingNews.webUrl,
        });
      }
    }
  });

  return EnrichedHaikusList;
}

// TODO: Merge the two functions by adding a parameter -> too much code duplication right now + difficult to understand
// what is happening

/**
 * Fetches today's haikus from the database if they were already generated
 * If not, will generate today's haikus and store them in the database
 * @param date the date for which we want to generate the haikus
 * @param shouldGenerate if true, will generate the haikus if they were not already generated
 * @returns {Promise<Haiku[]>} The list of haikus generated
 */
export async function getOrCreateHaikus(
  date: Date,
  shouldGenerate: boolean,
  generateCount: number,
) {
  await loginToFirebase();

  const todayHaikus = await fetchHaikusFromFirebase(date);
  if (todayHaikus.length > 0) {
    console.log(`getOrCreateHaikus: Today's haikus were already generated`);
    console.log(
      `getOrCreateHaikus - Today's haikus:\n ${todayHaikus.map((haiku) => haiku.articleTitle).join("\n")}`,
    );
    return todayHaikus;
  }
  if (!shouldGenerate) {
    console.log(
      `getOrCreateHaikus: Today's haikus were not generated yet, and should not be generated`,
    );
    return [];
  }
  console.log(
    `getOrCreateHaikus: Today's haikus were not generated yet, generating...`,
  );
  const enrichedHaikusList = await generateHaikuList(date, generateCount);
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
export async function generateHaikusIfNeeded(
  date: Date,
  generateCount: number,
) {
  await loginToFirebase();

  const todayHaikuCount = await fetchHaikuCountFromFirebase(date);
  if (todayHaikuCount > 0) {
    console.log(
      `GenerateHaikusIfNeeded - Today's (${date.toLocaleString()}) haikus were already generated`,
    );
    return;
  }
  // If we didn't generate the haikus yet, we will generate them
  console.log(
    `GenerateHaikusIfNeeded - Today's haikus (${date.toLocaleString()}) were not generated yet, generating...`,
  );
  const enrichedHaikusList = await generateHaikuList(date, generateCount);
  // Now we have to store the haikus in the database, and return them
  const haikuWithIdList = await storeHaikusInFirebase(enrichedHaikusList);
  return;
}

export default getOrCreateHaikus;
