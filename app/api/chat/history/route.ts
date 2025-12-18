import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") ?? "general";

  const key =
    topic === "grants"
      ? "chat:grants"
      : "chat:general";

  const r = redis(); // ⬅️ WAŻNE
  const raw = await r.get(key);

  const history = raw ? JSON.parse(raw) : [];

  return NextResponse.json(history);
}
