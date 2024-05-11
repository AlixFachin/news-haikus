"use server";
import { fetchHaikuPageFromFirebase } from "@/utils/firebase";

export async function sa_fetchHaikus(afterId: string | undefined) {
  const PAGE_SIZE = 6;

  try {
    const haikuList = await fetchHaikuPageFromFirebase(
      undefined,
      afterId,
      PAGE_SIZE,
    );
    return haikuList;
  } catch (e) {
    return { error: "Error fetching haikus" };
  }
}
