import { NextRequest } from "next/server";
import { getSessionId } from "@/lib/session";
import { workflowIdForTopic } from "@/lib/chat";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ topic: string }> }
) {
  const { topic } = await context.params;

  const workflowId = workflowIdForTopic(topic);
  const sessionId = await getSessionId();

  // ✅ DEBUG — TERAZ MA SENS
  console.log("CHAT TOPIC:", topic);
  console.log("WORKFLOW ID:", workflowId);

  const res = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      workflow: { id: workflowId },
      user: `${sessionId}:${topic}`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: 500 });
  }

  const data = await res.json();

  return Response.json({
    client_secret: data.client_secret,
  });
}
