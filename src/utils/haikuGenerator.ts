import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

import { GenHaikuParameters } from "./types";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set");
}

import { BasicHaikuSchema } from "./types";
import { z } from "zod";

export const generateHaiku = async (options: GenHaikuParameters) => {
  const generativeAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

  const modelTemperature = options.temperature || 0.9;
  const modelTopK = options.topK || 5;
  const modelTopP = options.topP || 0.8;

  const model = await generativeAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: modelTemperature,
      topK: modelTopK,
      topP: modelTopP,
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
      text: `You are an expert in Japanese culture and knows how to write perfect Japanese, including the ability to write senryu which are poems in Japanese.

**senryu** (川柳) is a type of short Japanese poem that uses imagery, wordplay, and wit to capture a moment or observation about human nature. It is similar to the haiku,
but with a more satirical and humorous tone. While haiku focuses on nature and the beauty of the present moment, senryu often explores the follies and foibles of humanity.

**Characteristics:**

* **Syllable Count:** senryu traditionally consists of three lines, with five syllables in the first line, seven syllables in the second line, and five syllables in the third line. 
This 5-7-5 syllable count is similar to the haiku.
* **Humorous or Satirical Tone:** senryu often uses humor, irony, and satire to convey its message. It may poke fun at human behavior, social conventions, or everyday situations.
* **Everyday Language:** senryu uses simple, everyday language and imagery, making it accessible to a wide audience. It often draws upon common experiences and observations of daily life.
* **Surprise or Twist:** senryu often contains a surprise or twist at the end, which adds to its humorous or thought-provoking effect. This twist may come in the form of a sudden shift in perspective,
a clever turn of phrase, or an unexpected punchline.

**Writing senryu:**
* **Focus on Human Nature:** senryu typically focuses on human nature, capturing the follies and foibles of everyday life.
It may explore themes such as love, loss, aging, relationships, and social conventions.
* **Use Imagery and Wordplay:** senryu often relies on vivid imagery and wordplay to create a memorable and impactful poem.
It may use metaphors, similes, puns, and other figures of speech to convey its message.
* **Surprise or Twist:** A well-written senryu often contains a surprise or twist at the end, which adds to its humorous or thought-provoking effect. This twist may come in the form of a sudden shift in perspective,
a clever turn of phrase, or an unexpected punchline.\n\n**What you need to do**

Compose a senryu on the topic of ${options.topic} that incorporates humor, irony, or satire. Use vivid imagery and wordplay to create a memorable and impactful poem.
Aim for a 5-7-5 syllable count and include a surprise or twist at the end. It is better to respect the 5-7-5 syllabe count and digress from the topic if needed,
rather than to be close to the topic but missing the syllabe count.
Please output the senryu in the shape of a JSON object with the schema containing one property called "senryu" containing the senryu in Japanese,
"reading" with the reading in English, and "en" with an English translation.

** Examples **
Some examples of desired behaviour are:
**input**:
drink etiquette
**output**:
{ "senryu": "飲み会で\\n空気が読める\\nいい上司" ,
  "reading": "Nomikaide \\n kuuki wo yomeru \\n ii joshi",
  "en": "At a drinking party\\nThe one who can read the air\\n Is a good boss"}

**input**: politicians
**output**:
{ "senryu": "政治家も\\n私も嘘が\\n下手である",
    "reading": "seijika mo \\n watashi mo uso ga \\n heta de aru",
    "en": "Politicians as well \\n Like me \\n Are bad at lying"
}

**Task Input**: ${options.topic}
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

    console.log(`Haiku Generator: generated Haiku: ${text}\n-=-=-=-=-=-=-=`);
    // Sometimes the AI generates triple-backquotes with JSON before
    // so we will use a regex to extract the actual JSON-object string
    const extractJSONregex = /\{(?:.*\n)*\}/g;
    const match = extractJSONregex.exec(text);
    if (!match) {
      console.error("No JSON-object found in the AI response");
      return undefined;
    }
    const parsedText = JSON.parse(match[0]);
    const zodParseResult = BasicHaikuSchema.safeParse(parsedText);
    // we add the topic in the return object so that we can connect the haiku with the meta-data
    if (zodParseResult.success) {
      const haiku = zodParseResult.data;
      return { ...haiku, topic: options.topic };
    } else {
      console.error(
        `Haiku Generator - Error parsing haiku: ${zodParseResult.error}`,
      );
      return undefined;
    }
  } catch (e) {
    // TODO Test if this is a ZodError
    console.error(e);
    return undefined;
  }
};

export default generateHaiku;
