import { generateOneHaikuFromDate } from "@/utils/main";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

const HAIKUS_GENERATED_IN_ROUTE = 1;

// Forcing the route to be revalidated on every request
// TODO: Once stabilized, can increase the revalidation cache to a bit less than one day.
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = 0;

export async function GET(request: Request) {
  // We will call the function which creates the haikus
  const t0 = performance.now();
  try {
    const date = dayjs();
    console.log(
      `Cron job started at ${date.format("YYYY-MM-DD HH:mm:ss")} - Haikus Generation`,
    );
    await generateOneHaikuFromDate(date.toDate());
    const t1 = performance.now();
    console.log(
      `Haikus generation in Cron job finished in ${t1 - t0} milliseconds`,
    );
    return NextResponse.json(
      { status: "Success", date: date.format("YYYY-MM-DD HH:mm:ss") },
      { status: 200 },
    );
  } catch (e) {
    let err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
