// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  addDoc,
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
    console.log(`Already logged in as ${auth.currentUser?.email}`);
    return;
  }

  const fbUser = process.env.FIREBASE_USER;
  const fbPwd = process.env.FIREBASE_PWD;

  if (!fbUser || !fbPwd) {
    throw new Error("Firebase credentials not set");
  }

  const userCredentials = await signInWithEmailAndPassword(auth, fbUser, fbPwd);
  const user = userCredentials.user;
  console.log(`User = ${user.email}`);
}

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
    console.log(`Found ${doc.data()}`);
    const haiku = HaikuDBSchema.parse(doc.data());
    result.push(haiku);
  });

  return result;
}

export async function storeHaikusInFirebase(haikus: Haiku[]) {
  const auth = getAuth(app);
  if (!auth.currentUser) {
    await loginToFirebase();
  }

  const db = getFirestore(app);
  const haikusRef = collection(db, "haikus");

  await Promise.all(haikus.map((haiku) => addDoc(haikusRef, haiku)));
}
