import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json({
    client_secret: "fake-session-" + Date.now(),
  });
}
