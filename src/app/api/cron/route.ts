import { generateHaikusIfNeeded } from "@/utils/main";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // We will call the function which creates the haikus
  try {
    await generateHaikusIfNeeded(new Date());
    return NextResponse.json({ status: "Success" }, { status: 200 });
  } catch (e) {
    let err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
