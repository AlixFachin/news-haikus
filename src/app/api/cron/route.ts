import getHaikus from "@/utils/main";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // We will call the function which creates the haikus
  try {
    const haikus = await getHaikus(new Date());
    return NextResponse.json(haikus, { status: 200 });
  } catch (e) {
    let err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
