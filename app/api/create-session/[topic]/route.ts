import { NextRequest } from "next/server";
import { getSessionId } from "@/lib/session";
import { getRedis } from "@/lib/redis";
import { workflowIdForTopic } from "@/lib/chat";

async function handle(topic: string) {
  const sessionId = await getSessionId();
  const redis = await getRedis();

  const key = `chatkit:${topic}:${sessionId}`;

  const cached = await redis.get(key);
  if (cached) {
    return Response.json({ client_secret: cached });
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
    throw new Error(text);
  }

  const data = await res.json();

  await redis.set(key, data.client_secret, {
    EX: 60 * 60 * 24,
  });

  return Response.json({ client_secret: data.client_secret });
}

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ topic: string }> }
) {
  const { topic } = await context.params;
  return handle(topic
