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
  limit,
  addDoc,
  doc,
  getDoc,
  writeBatch,
  orderBy,
  deleteDoc,
  startAt,
  startAfter,
  endAt,
  endBefore,
} from "firebase/firestore";
import type { Haiku } from "@/utils/types";
import { HaikuDBSchema } from "@/utils/types";
import { createHash } from "crypto";
import {
  getDateFormatJapanTime,
  getDateFormatJapanTimeFromDayjs,
} from "@/utils/datetimeUtils";

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
  const dateKey = getDateFormatJapanTime(date);

  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = query(
    collection(db, "haikus"),
    where("date", "==", dateKey),
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
 * Downloads from the database all the haikus for a given user (=Clerk UserId)
 * @param userId string - the Clerk userId for which to fetch the haikus
 * @returns the list of haikus for the given user
 */
export async function fetchHaikusFromFirebaseByUser(userId: string) {
  const result: Haiku[] = [];
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = query(
    collection(db, "haikus"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
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
  const dateKey = getDateFormatJapanTime(date);

  const db = getFirestore(app);
  const q = userId
    ? query(
        collection(db, "haikus"),
        where("date", "==", dateKey),
        where("userId", "==", userId),
      )
    : query(collection(db, "haikus"), where("date", "==", dateKey));

  const haikuCount = await getCountFromServer(q);
  return haikuCount.data().count;
}

/**
 * Main pagination function for the haiku fetch and display function
 * NOTE: This pagination is not stable regarding database mutations
 * it is better to use a cursor pagination to get more stable results.
 * TODO: Implement cursor pagination, the issue being to store the cursor across pages.
 * @param startIndex first haiku index
 * @param pageSize number of haikus returned.
 */
export async function fetchHaikuPageFromFirebase(
  beforeId: string | undefined,
  afterId: string | undefined,
  pageSize: number,
) {
  const result: Haiku[] = [];

  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }
  const db = getFirestore(app);

  // The previous page is the MAX of the haikus before the first ID
  // The next page is the MIN of the haikus after the last ID.

  let q;
  if (beforeId) {
    const beforeDoc = await getDoc(doc(db, "haikus", beforeId));
    q = query(
      collection(db, "haikus"),
      orderBy("date", "asc"),
      orderBy("__name__", "asc"),
      startAfter(beforeDoc),
      limit(pageSize),
    );
  } else if (afterId) {
    const afterDoc = await getDoc(doc(db, "haikus", afterId));
    q = query(
      collection(db, "haikus"),
      orderBy("date", "desc"),
      orderBy("__name__", "desc"),
      startAfter(afterDoc),
      limit(pageSize),
    );
  } else {
    q = query(
      collection(db, "haikus"),
      orderBy("date", "desc"),
      orderBy("__name__", "desc"),
      limit(pageSize),
    );
  }
  const querySnapshot = await getDocs(q);
  console.log(
    `beforeId=${beforeId}, afterId=${afterId}, QuerySnapshot size: ${querySnapshot.size}`,
  );
  querySnapshot.forEach((doc) => {
    const haiku = HaikuDBSchema.parse(doc.data());
    console.log(`Found haiku: ${JSON.stringify(haiku)}`);
    result.push({ ...haiku, id: doc.id });
  });

  // We have to sort the result in the right order (case of beforeID where the query was the opposite order)
  if (beforeId) {
    result.sort((a, b) => {
      if (a.date === b.date) {
        return b.id.localeCompare(a.id);
      }
      return b.date.localeCompare(a.date);
    });
  }

  return result;
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

/**
 * Deletes one haiku from the database. Note: This function will check whether the user is an admin or if they have the right to delete the haiku
 * @param haikuId the haikuID to be deleted
 * @param userId the current user ID of the logged user
 * @param isAdmin boolean indicating if the user is an admin, this will override the userId check
 */
export async function deleteHaikuFromFirebase(haikuId: string, userId: string, isAdmin: boolean) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const haikuDocRef = doc(db, "haikus", haikuId);
  const haiku =  await getDoc(haikuDocRef);
  const haikuData = HaikuDBSchema.parse(haiku.data());
  if (!isAdmin && haikuData.userId !== userId) {
    throw new Error("User does not have permission to delete this haiku");
  }
  await deleteDoc(haikuDocRef);
}

import { newsSchemaType } from "./news";
import { Dayjs } from "dayjs";

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
export async function getNewsFromFirebase(date: Dayjs) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const dateKey = getDateFormatJapanTimeFromDayjs(date);
  const db = getFirestore(app);
  const q = query(collection(db, "news"), where("date", "==", dateKey));

  const result: NewsArticle[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    result.push(doc.data() as NewsArticle);
  });
  return result;
}

/**
 * Fetches the given number of articles saved in the database up to the given date
 * @param date upper limit of news date - in YYYYMMDD format
 * @param count number of news to be returned
 * @returns array of NewsArticles objects
 */
export async function getLatestNewsFromFirebase(date: Dayjs, count: number) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const dateKey = getDateFormatJapanTimeFromDayjs(date);
  const db = getFirestore(app);
  const q = query(
    collection(db, "news"),
    where("date", "<=", dateKey),
    orderBy("date", "desc"),
    limit(count),
  );

  const result: NewsArticle[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    result.push(doc.data() as NewsArticle);
  });
  return result;
}

export async function deleteNewsFromFirebase(newsId: string) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = query(collection(db, "news"), where("id", "==", newsId));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs.at(0);
  if (doc) {
    await deleteDoc(doc.ref);
  }
}
