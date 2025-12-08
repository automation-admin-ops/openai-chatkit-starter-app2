import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { workflowId, sessionId } = body;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Brak OPENAI_API_KEY" }, { status: 500 });
  }

  // 🔁 Jeśli mamy sessionId → odświeżamy tylko client_secret
  if (sessionId) {
    const res = await fetch(
      `https://api.openai.com/v1/chatkit/sessions/${sessionId}/client_secret`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "chatkit_beta=v1",
        },
      }
    );

    const data = await res.json();
    return NextResponse.json({
      client_secret: data.client_secret,
      session_id: sessionId,
    });
  }

  // 🆕 Jeśli nie mamy sesji → tworzymy nową
  if (!workflowId) {
    return NextResponse.json({ error: "Brak workflowId" }, { status: 400 });
  }

  const res = await fetch(`https://api.openai.com/v1/chatkit/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      user: crypto.randomUUID(),
      workflow: { id: workflowId },
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    client_secret: data.client_secret,
    session_id: data.id,
  });
}
