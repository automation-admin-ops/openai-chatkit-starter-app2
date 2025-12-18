import { NextRequest, NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import { getRedis } from "@/lib/redis";
import type { ChatTopic } from "@/lib/chat";

export async function POST(
  _req: NextRequest,
  { params }: { params: { topic: ChatTopic } }
) {
  const sessionId = await getSessionId(); // ⬅️ MUSI BYĆ await
  const redis = await getRedis();

  const key = `chatkit:${params.topic}:${sessionId}`;

  const existing = await redis.get(key);
  if (existing) {
    return NextResponse.json({
      client_secret: existing,
    });
  }

  const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-realtime-preview",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text, { status: 500 });
  }

  const data = await res.json();

  await redis.set(key, data.client_secret, {
    EX: 60 * 60, // 1 godzina
  });

  return NextResponse.json({
    client_secret: data.client_secret,
  });
}
