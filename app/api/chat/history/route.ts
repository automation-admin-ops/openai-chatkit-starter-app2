import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") ?? "general";

  const key =
    topic === "grants"
      ? "chat:grants"
      : "chat:general";

  const redis = await getRedis(); // ⬅️ POPRAWKA
  const raw = await redis.get(key);

  const history = raw ? JSON.parse(raw) : [];

  return NextResponse.json(history);
}
