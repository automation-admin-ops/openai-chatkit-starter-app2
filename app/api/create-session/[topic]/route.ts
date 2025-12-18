import { NextRequest } from "next/server";
import { getSessionId } from "@/lib/session";
import { getRedis } from "@/lib/redis";
import { workflowIdForTopic } from "@/lib/chat";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ topic: string }> }
): Promise<Response> {
  const { topic } = await context.params;

  const sessionId = await getSessionId();
  const redis = await getRedis();

  const key = `chatkit:${topic}:${sessionId}`;

  const cached = await redis.get(key);
  if (cached) {
    return new Response(
      JSON.stringify({ client_secret: cached }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      workflow: { id: workflowIdForTopic(topic as any) },
      user: sessionId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: 500 });
  }

  const data = await res.json();

  await redis.set(key, data.client_secret, {
    EX: 60 * 60 * 24, // 24h
  });

  return new Response(
    JSON.stringify({ client_secret: data.client_secret }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
