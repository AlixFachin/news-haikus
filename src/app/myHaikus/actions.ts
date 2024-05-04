"use server";

import { deleteHaikuFromFirebase } from "@/utils/firebase";
import { auth } from "@clerk/nextjs";

export async function sa_deleteHaiku(haikuId: string) {
  const { userId, has } = auth();

  if (!userId) {
    return { error: "You need to be logged in to generate haikus" };
  }

  try {
    await deleteHaikuFromFirebase(haikuId, userId, has({ role: "org:admin" }));
  } catch (e) {
    return { error: `Error deleting haiku: ${e}` };
  }
}
