// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  getDocs,
  collection,
  getCountFromServer,
  query,
  where,
  addDoc,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import type { Haiku } from "@/utils/types";
import { HaikuDBSchema } from "@/utils/types";
import dayjs from "dayjs";
import { createHash } from "crypto";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbTxQbWPWY6euR7BR8kWa1y6V4O63XJAQ",
  authDomain: "news-haikus.firebaseapp.com",
  projectId: "news-haikus",
  storageBucket: "news-haikus.appspot.com",
  messagingSenderId: "523118403811",
  appId: "1:523118403811:web:5c4981b42728f9b128a5d6",
  measurementId: "G-P7Z7YZNZBQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export async function loginToFirebase() {
  const auth = getAuth(app);

  if (auth.currentUser?.uid == process.env.FIREBASE_UID) {
    console.log(
      `FIREBASE AUTH: Already logged in as ${auth.currentUser?.email}`,
    );
    return;
  }

  const fbUser = process.env.FIREBASE_USER;
  const fbPwd = process.env.FIREBASE_PWD;

  if (!fbUser || !fbPwd) {
    throw new Error("Firebase credentials not set");
  }

  const userCredentials = await signInWithEmailAndPassword(auth, fbUser, fbPwd);
  const user = userCredentials.user;
  console.log(`FIREBASE AUTH: User = ${user.email}`);
}

/**
 * returns the list of haikus for a given date
 * @param date the date for which to fetch the haikus
 * @returns
 */
export async function fetchHaikusFromFirebase(date: Date, userId: string) {
  const result: Haiku[] = [];

  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = query(
    collection(db, "haikus"),
    where("date", "==", dayjs(date).format("YYYYMMDD")),
    where("userId", "==", userId),
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const haiku = HaikuDBSchema.parse(doc.data());
    result.push({ ...haiku, id: doc.id });
  });

  return result;
}

/**
 * returns the number of haikus in a database for a given date
 * @param date the date for which to fetch the haikus
 * @param userId the user id for which to fetch the haikus, or undefined if we want to get count of all haikus for all users
 * @returns the number of haikus
 */
export async function fetchHaikuCountFromFirebase(
  date: Date,
  userId: string | undefined,
) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = userId
    ? query(
        collection(db, "haikus"),
        where("date", "==", dayjs(date).format("YYYYMMDD")),
        where("userId", "==", userId),
      )
    : query(
        collection(db, "haikus"),
        where("date", "==", dayjs(date).format("YYYYMMDD")),
      );

  const haikuCount = await getCountFromServer(q);
  return haikuCount.data().count;
}

export async function fetchOneHaikuFromFirebase(haikuId: string) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const haikuDocRef = doc(db, "haikus", haikuId);
  const haikuDoc = await getDoc(haikuDocRef);

  if (!haikuDoc.exists()) {
    console.error(`Document not found for haikuId: ${haikuId}`);
    return undefined;
  }

  try {
    const haiku = HaikuDBSchema.parse(haikuDoc.data());
    return haiku;
  } catch (e) {
    console.error(
      `FetchOneHaikuFromDB: Error parsing haiku ${haikuId}:\n The Haiku data was: ${JSON.stringify(haikuDoc.data())}\n The error is: ${e}`,
    );
    return undefined;
  }
}
/**
 * Returns the list of haikuIds parameters used by Next to generate static pages at build time
 * @returns string[]
 */
export async function getAllHaikuIdsFromFirebase() {
  const result: string[] = [];

  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const allHaikus = await getDocs(collection(db, "haikus"));

  allHaikus.forEach((doc) => {
    result.push(doc.id);
  });

  return result;
}

/**
 * Stores a list of haikus in the Firebase database
 * (Expect to be called only when the system generates a bunch of haikus daily)
 * @param haikus the list of haikus to store
 * @returns the list of haikus with their ids
 */
export async function storeHaikusInFirebase(
  haikus: Omit<Haiku, "id">[],
): Promise<Haiku[]> {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const haikusRef = collection(db, "haikus");

  return Promise.all(
    haikus.map(async (haiku) => {
      const docRef = await addDoc(haikusRef, haiku);
      const doc = await getDoc(docRef);
      if (!doc.exists()) {
        console.error(`Error storing haiku: ${JSON.stringify(haiku)}`);
        return undefined;
      }
      return { ...haiku, id: doc.id };
    }),
  ).then((haikus) =>
    // Note that we use a type predicate to tell Typescript that all 'undefined' values will be filtered out
    haikus.filter((haiku): haiku is Haiku => !!haiku),
  );
}

/**
 * Stores a given haiku in the database
 * @param haiku the haiku to store in the database
 * @returns the haiku with its id
 */
export async function storeHaikuInFirebase(
  haiku: Omit<Haiku, "id" | "userId">,
  userId: string,
): Promise<Haiku | undefined> {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  // TODO: Do not catch exceptions - raise exceptions in above layer so that error message/reason can be conveyed

  // Checking if the user didn't generate too many haikus today if the user is not admin
  // TODO: Really need to log the actual GENERATION rather than the storage (what if bad user keeps generating but stores nothing?)
  if (userId !== process.env.ADMIN_USER_ID) {
    const nr_haikus = await fetchHaikuCountFromFirebase(new Date(), userId);
    if (nr_haikus >= Number(process.env.MAX_HAIKUS_PER_DAY)) {
      console.error(`User ${userId} has generated too many haikus today`);
      return undefined;
    }
  }

  try {
    const db = getFirestore(app);
    const haikusRef = collection(db, "haikus");
    const docRef = await addDoc(haikusRef, { ...haiku, userId: userId });
    const doc = await getDoc(docRef);
    if (!doc.exists()) {
      console.error(`Error storing haiku: ${JSON.stringify(haiku)}`);
      return undefined;
    }
    return { ...haiku, id: doc.id, userId: userId };
  } catch (e) {
    console.error(`Error storing haiku: ${JSON.stringify(haiku)}\nError: ${e}`);
    return undefined;
  }
}

import { newsSchemaType } from "./news";

type NewsArticle = newsSchemaType["results"][number] & { date: string };

/**
 * store a list of News Articles in the database
 * @param newsList list of article data to be stored
 */
export async function storeNewsInFirebase(newsList: NewsArticle[]) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const batch = writeBatch(db);
  newsList.forEach((news) => {
    const hash = createHash("sha256");
    // Using the SHA256 hash of the news id as the document id
    hash.update(news.id);
    const docId = hash.digest("hex");
    const docRef = doc(db, "news", docId);
    batch.set(docRef, news);
  });
  await batch.commit();
}

/**
 * Fetches the news saved in the database for a given date
 * @param date the date at which we want to retrieve the news
 */
export async function getNewsFromFirebase(date: Date) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = query(
    collection(db, "news"),
    where("date", "==", dayjs(date).format("YYYYMMDD")),
  );

  const result: NewsArticle[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    result.push(doc.data() as NewsArticle);
  });
  return result;
}