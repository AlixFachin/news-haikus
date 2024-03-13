import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

import zod, { ZodError } from "zod";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set");
}

const topicSchema = zod.array(
  zod.object({
    title: zod.string(),
    classification: zod.number(),
    topic: zod.string(),
  }),
);

export type TopicDataArray = zod.infer<typeof topicSchema>;

export const extractTopicFromTitles = async (
  titles: string[],
): Promise<TopicDataArray> => {
  const generativeAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = await generativeAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.9,
      topK: 5,
      topP: 0.8,
    },
  });

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    {
      text: `Your task is to extract the topic and some classification about a news title given as input.
To figure out the **topic**, please output the overall topic that this article is likely to deal with in a maximum of 4 words. Try to be as specific as possible, but respect the maximum of 4 words.
For **classification**, output an integer between 0 and 10, where 0 is a very pessimistic article and 10 is an article which is either funny or optimitic / feel-good.
Your output will be given as input to another task, so it is important to strictly respect the output schema as an array of JSON objects.
**Format:**
* **Input**: Array containing news titles
* **Output**: Array containing JSON objects with a "title" property containing the original title, "classification" is an integer between 0 and 10 corresponding to your classification 
of this article, and a "topic" property containing a string with space-separated keywords maximum of three keywords per article title.

** Example:**
**Input**:
[ "Cost of raising children in China second-highest in world, thinktank reveals", "Play outside and sing together: what living in Denmark taught me about raising 'Viking' children",
"Expensive toilets cause a stink at Japan's world expo"]
**Output**:
[{ "title": "More women may be psychopaths than previously thought, says expert",
  "classification": 3,
  "topic": "Women surprisingly psychopaths"},
  { "title" : "Play outside and sing together: what living in Denmark taught me about raising 'Viking' children",
    "classification": 8,
    "topic": "Scandinavian family education"},
  { "title": "Expensive toilets cause a stink at Japan's world expo",
  "classification": 7,
   "topic": "Japan Expo issues"}]

**Task Input**:
[${titles.map((title) => `"${title}"`).join(", ")}]

**Task Output**:
`,
    },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    safetySettings,
  });

  const response = result.response;
  try {
    const text = response.text();
    const topicObject = JSON.parse(text);
    const topicObjectSafe = topicSchema.parse(topicObject);
    return topicObjectSafe;
  } catch (e) {
    console.error(
      `Failed to parse the response when extracting topics from titles: ${e}`,
    );
    if (e instanceof ZodError) {
      const zodError = e as ZodError;
      for (const issue of zodError.issues) {
        console.error(issue);
      }
    }
    return titles.map((title) => ({
      title: title,
      classification: 5,
      topic: title.split(" ").slice(0, 3).join(" "),
    }));
  }
};

export default extractTopicFromTitles;
