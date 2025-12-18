import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { normalizeTopic, type ChatTopic } from "@/lib/chat";
import { getSessionId } from "@/lib/session";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function workflowIdFor(topic: ChatTopic) {
  if (topic === "grants") return process.env.WORKFLOW_GRANTS_ID;
  return process.env.WORKFLOW_GENERAL_ID;
}

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ topic: string }> }
) {
  const { topic: rawTopic } = await context.params;
  const topic = normalizeTopic(rawTopic);

  const workflowId = workflowIdFor(topic);
  if (!workflowId) {
    return NextResponse.json(
      { error: `Missing workflow env for topic=${topic}` },
      { status: 500 }
    );
  }

  const sid = await getSessionId();

  // KLUCZ: oddzielny "user" per chat -> historia się nie miesza
  const user = `${sid}:${topic}`;

  const session = await openai.chatkit.sessions.create({
    workflow: { id: workflowId },
    user,
  });

  return NextResponse.json({ client_secret: session.client_secret });
}
