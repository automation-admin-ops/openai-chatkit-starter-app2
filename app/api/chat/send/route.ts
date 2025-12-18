import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request: Request) {
  const body = await request.json();
  const topic = body?.topic === "grants" ? "grants" : "general";

  const key =
    topic === "grants"
      ? "chat:grants"
      : "chat:general";

  const r = redis(); // ⬅️ KLUCZOWA LINIA
  const raw = await r.get(key);
  const history = raw ? JSON.parse(raw) : [];

  history.push({
    role: "user",
    content: body.message,
    createdAt: new Date().toISOString(),
  });

  await r.set(key, JSON.stringify(history));

  return NextResponse.json({ ok: true });
}
