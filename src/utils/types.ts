import zod from "zod";

export const HaikuDBSchema = zod.object({
  senryu: zod.string(),
  reading: zod.string(),
  en: zod.string(),
  date: zod.string(),
  articleTitle: zod.string(),
  articleUrl: zod.string(),
  topic: zod.string(),
  classification: zod.number(),
});

export type Haiku = zod.infer<typeof HaikuDBSchema> & { id: string };

// BasicHaiku will represent the type returned by the generative model
export const BasicHaikuSchema = zod.object({
  senryu: zod.string(),
  reading: zod.string(),
  en: zod.string(),
  topic: zod.string().optional(),
});

export type BasicHaiku = zod.infer<typeof BasicHaikuSchema>;

export const GenerateParamSchema = zod.object({
  temperature: zod.number().optional(),
  topK: zod
    .number()
    .int("topK must be an integer!")
    .gt(0, "topK must be greater than 0!")
    .lt(5, "topK must be less than 5!")
    .optional(),
  topP: zod
    .number()
    .gt(0, "topP must be between 0 and 1")
    .lt(1, "topP must be between 0 and 1")
    .optional(),
  topic: zod.string(),
});

export type GenHaikuParameters = zod.infer<typeof GenerateParamSchema>;
  