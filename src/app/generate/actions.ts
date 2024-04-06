"use server";

import { generateHaiku } from "@/utils/haikuGenerator";
import { storeHaikuInFirebase } from "@/utils/firebase";
import type { Haiku, GenHaikuParameters } from "@/utils/types";
import { GenerateParamSchema } from "@/utils/types";
import { revalidatePath } from "next/cache";

export async function sa_generateHaiku(parameters: GenHaikuParameters) {
  try {
    const parsedParams = GenerateParamSchema.parse(parameters);
    const haiku = await generateHaiku(parsedParams);

    if (!haiku) {
      return { error: "No haiku generated!" };
    }

    return haiku;
  } catch (e) {
    return { error: `Invalid parameters:\n${e}` };
  }
}

export async function sa_saveHaikuInDB(haiku: Omit<Haiku, "id">) {
  const savedHaiku = await storeHaikuInFirebase(haiku);
  if (!savedHaiku) {
    return { error: "Error saving haiku" };
  }
  revalidatePath("/", "page");
  return savedHaiku;
}