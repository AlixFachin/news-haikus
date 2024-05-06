import { NextResponse } from "next/server";
import { getNews } from "@/utils/news";
import dayjs from "dayjs";

// Forcing the route to be revalidated on every request
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
// TODO: Once stabilized, can increase the revalidation cache to a bit less than one day.
export const revalidate = 0;

export async function GET(request: Request) {
  // We will call the function which creates the haikus
  try {
    
    let t0 = performance.now();
    const date = dayjs();
    console.log(
      `Cron job started at ${date.format("YYYY-MM-DD HH:mm:ss")} - News Download`,
    );
    const newsList = await getNews();
    let t1 = performance.now();
    console.log(
      `News download + write in Cron job finished in ${t1 - t0} milliseconds`,
    );
    return NextResponse.json(
      {
        status: "Success",
        date: date.format("YYYY-MM-DD HH:mm:ss"),
        message: `Downloaded ${newsList.length} news articles`,
      },
      { status: 200 },
    );
  } catch (e) {
    let err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
