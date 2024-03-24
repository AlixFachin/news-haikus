import { generateHaikusIfNeeded } from "@/utils/main";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

const HAIKUS_GENERATED_IN_ROUTE = 3;

// Forcing the route to be revalidated on every request
// TODO: Once stabilized, can increase the revalidation cache to a bit less than one day.
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const revalidate = 0;

export async function GET(request: Request) {
  // We will call the function which creates the haikus
  try {
    const date = dayjs();
    console.log(`Cron job started at ${date.format("YYYY-MM-DD HH:mm:ss")}`);
    await generateHaikusIfNeeded(date.toDate(), HAIKUS_GENERATED_IN_ROUTE);
    return NextResponse.json(
      { status: "Success", date: date.format("YYYY-MM-DD HH:mm:ss") },
      { status: 200 },
    );
  } catch (e) {
    let err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
