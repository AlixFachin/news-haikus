import { HaikuContainer } from "@/components/HaikuContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      <h1 className="text-6xl font-bold">Today's Haikus</h1>
      <section>{/* <HaikuContainer /> */}</section>
    </main>
  );
}
