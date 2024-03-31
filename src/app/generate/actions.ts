"use server";

import { generateHaiku } from "@/utils/haikuGenerator";
import { storeHaikuInFirebase } from "@/utils/firebase";
import type { Haiku } from "@/utils/types";
import { revalidatePath } from "next/cache";

import z from "zod";

const GenerateParamSchema = z.object({
  temperature: z.number().optional(),
  topK: z.number().optional(),
  topP: z.number().optional(),
  prompt: z.string().optional(),
  topic: z.string(),
});

export type GenHaikuParameters = z.infer<typeof GenerateParamSchema>;

export async function sa_generateHaiku(parameters: GenHaikuParameters) {
  // TODO: Parameter validation
  const haiku = await generateHaiku(parameters.topic);

  if (!haiku) {
    return { error: "No haiku generated!" };
  }

  return haiku;
}

export async function sa_saveHaikuInDB(haiku: Omit<Haiku, "id">) {
  const savedHaiku = await storeHaikuInFirebase(haiku);
  if (!savedHaiku) {
    return { error: "Error saving haiku" };
  }
  revalidatePath("/", "page");
  return savedHaiku;
}