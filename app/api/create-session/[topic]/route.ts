import { NextRequest } from "next/server";
import { redis } from "@/lib/redis";
import { getSessionId } from "@/lib/session";
import { isChatTopic, workflowIdForTopic } from "@/lib/chat";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ topic: string }> }
) {
  const { topic } = await context.params;

  if (!isChatTopic(topic)) {
    return Response.json({ error: "Invalid topic" }, { status: 404 });
  }

  const sid = getSessionId();
  const key = `chatkit:${topic}:${sid}`;

  const r = redis();

  // 1️⃣ jeśli mamy zapisaną sesję → zwracamy (persist historii)
  const cached = await r.get(key);
  if (cached) {
    return Response.json({ client_secret: cached });
  }

  // 2️⃣ tworzymy nową ChatKit session
  const resp = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      workflow: { id: workflowIdForTopic(topic) },
      user: sid,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return Response.json({ error: text }, { status: 500 });
  }

  const data = await resp.json();

  // 3️⃣ zapisujemy client_secret (7 dni)
  await r.set(key, data.client_secret, {
    EX: 60 * 60 * 24 * 7,
  });

  return Response.json({ client_secret: data.client_secret });
}
