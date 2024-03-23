import { generateHaikusIfNeeded } from "@/utils/main";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

const HAIKUS_GENERATED_IN_ROUTE = 3;

export async function GET(request: Request) {
  // We will call the function which creates the haikus
  // TODO: Protect the API route with a secret token
  try {
    const date = dayjs();
    console.log(`Cron job started at ${date.format("YYYY-MM-DD HH:mm:ss")}`);
    await generateHaikusIfNeeded(date.toDate(), HAIKUS_GENERATED_IN_ROUTE);
    return NextResponse.json({ status: "Success" }, { status: 200 });
  } catch (e) {
    let err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
