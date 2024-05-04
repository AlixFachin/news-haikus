import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import HaikuList from "@/components/HaikuList";
import { auth } from "@clerk/nextjs/server";
import { fetchHaikusFromFirebaseByUser } from "@/utils/firebase";
import type { Metadata } from "next";

export function generateMetadata({
  params,
}: {
  params: { haikuId: string };
}): Metadata {
  return {
    title: "AI-Generated Haikus (My List)",
    description: "List of AI-generated haikus that I created",
    keywords: ["haiku", "AI", "news", "Gemini", "senryu", "Japanese"],
    authors: [{ name: "Alix Fachin", url: "https://codeandpastries.dev" }],
  };
}

const UserHaikuList = async () => {
  const { userId } = auth();
  if (!userId) {
    return <p>Need to be logged in!</p>;
  }
  const haikuList = await fetchHaikusFromFirebaseByUser(userId);

  return <HaikuList haikus={haikuList} orientation="List" />;
};

export default function MyHaikus() {
  return (
    <main className="flex min-h-screen flex-col flex-wrap items-center justify-evenly sm:p-4 xl:p-24">
      <h1 className="mb-4 text-4xl font-bold sm:text-6xl md:mb-8">My Haikus</h1>
      <section>
        <Suspense fallback={<Spinner />}>
          <UserHaikuList />
        </Suspense>
      </section>
    </main>
  );
}
