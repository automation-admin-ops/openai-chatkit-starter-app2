import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const { chatType, message } = await req.json();

  if (!chatType || !message) {
    return NextResponse.json(
      { error: "Brak chatType lub message" },
      { status: 400 }
    );
  }

  const key =
    chatType === "grants"
      ? "chat:grants"
      : "chat:general";

  const raw = await redis.get(key);
  const history = raw ? JSON.parse(raw) : [];

  history.push({
    role: "user",
    content: message,
    ts: Date.now(),
  });

  await redis.set(key, JSON.stringify(history));

  return NextResponse.json({ ok: true });
}
