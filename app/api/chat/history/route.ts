import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatType = searchParams.get("chatType");

  const key =
    chatType === "grants"
      ? "chat:grants"
      : "chat:general";

  const raw = await redis.get(key);
  const history = raw ? JSON.parse(raw) : [];

  return NextResponse.json(history);
}
