import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatType = searchParams.get("chatType");

  const chatKey =
    chatType === "grants" ? "chat:grants" : "chat:general";

  const history =
    (await redis.get<any[]>(chatKey)) ?? [];

  return NextResponse.json(history);
}
