/**
 * GeneratePage: This UI will be used temporarily (i.e. until the 'cron' process is implemented)
 * It will
 * 1. Download the list of news article titles from the News API.
 * 2. Use GEMINI a first time for summary and article title categorization
 * 3. Select a subset of articles and try to generate a Senryu (or Haiku) for the most interesting
 * 4. Save into the FireStore database the Senryu and associated data
 */

export default function GeneratePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      <h1 className="text-6xl font-bold">Generate a Haiku</h1>
      <section>{/* <HaikuContainer /> */}</section>
    </main>
  );
}
