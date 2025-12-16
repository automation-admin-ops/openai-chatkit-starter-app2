import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const { chatType, message } = await req.json();

  if (!message || !chatType) {
    return NextResponse.json(
      { error: "Brak chatType lub message" },
      { status: 400 }
    );
  }

  const chatKey =
    chatType === "grants" ? "chat:grants" : "chat:general";

  const history =
    (await redis.get<any[]>(chatKey)) ?? [];

  history.push({
    role: "user",
    content: message,
    ts: Date.now(),
  });

  await redis.set(chatKey, history);

  return NextResponse.json({ ok: true });
}
