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

export type Haiku = zod.infer<typeof HaikuDBSchema>;

// BasicHaiku will represent the type returned by the generative model
export const BasicHaikuSchema = zod.object({
  senryu: zod.string(),
  reading: zod.string(),
  en: zod.string(),
  topic: zod.string().optional(),
});

export type BasicHaiku = zod.infer<typeof BasicHaikuSchema>;
