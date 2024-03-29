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
} from "firebase/firestore";
import type { Haiku } from "@/utils/types";
import { HaikuDBSchema } from "@/utils/types";
import dayjs from "dayjs";

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
export async function fetchHaikusFromFirebase(date: Date) {
  const result: Haiku[] = [];

  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = query(
    collection(db, "haikus"),
    where("date", "==", dayjs(date).format("YYYYMMDD")),
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
 * @returns the number of haikus
 */
export async function fetchHaikuCountFromFirebase(date: Date) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const q = query(
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
 * Stores the haikus in the Firebase database
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
