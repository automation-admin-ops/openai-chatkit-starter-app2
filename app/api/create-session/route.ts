import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Brak OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  // 🔁 1. Odświeżenie client_secret dla istniejącej sesji
  if (body.sessionId) {
    const res = await fetch(
      `https://api.openai.com/v1/chatkit/sessions/${body.sessionId}/client_secret`,
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
    });
  }

  // 🆕 2. Tworzenie nowej sesji na podstawie chatType
  const { chatType } = body;

  let workflowId: string | undefined;

  if (chatType === "general") {
    workflowId = process.env.WORKFLOW_GENERAL_ID;
  } else if (chatType === "dofinansowania") {
    workflowId = process.env.WORKFLOW_GRANTS_ID;
  }

  if (!workflowId) {
    return NextResponse.json(
      { error: "Nieznany chatType lub brak workflowId" },
      { status: 400 }
    );
  }

  const res = await fetch(
    "https://api.openai.com/v1/chatkit/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify({
        workflow_id: workflowId,
      }),
    }
  );

  const data = await res.json();

  return NextResponse.json({
    client_secret: data.client_secret,
    session_id: data.id,
  });
}
