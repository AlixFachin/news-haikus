"use server";

import { generateHaiku } from "@/utils/haikuGenerator";
import { storeHaikuInFirebase } from "@/utils/firebase";
import type { Haiku, GenHaikuParameters } from "@/utils/types";
import { GenerateParamSchema } from "@/utils/types";
import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

export async function sa_generateHaiku(parameters: GenHaikuParameters) {
  const { userId } = auth();

  if (!userId) {
    return { error: "You need to be logged in to generate haikus" };
  }

  // TODO: Get in the database the number of requests per day for this user
  // and reject a new Haiku creation if too many generated today

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
  const { userId } = auth();

  if (userId !== process.env.CLERK_ADMIN_ID) {
    return { error: "You are not allowed to save haikus" };
  }

  const savedHaiku = await storeHaikuInFirebase(haiku, userId);
  if (!savedHaiku) {
    return { error: "Error saving haiku" };
  }
  revalidatePath("/", "page");
  return savedHaiku;
}