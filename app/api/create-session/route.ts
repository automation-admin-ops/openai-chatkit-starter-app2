import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { workflowId } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Brak OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  if (!workflowId) {
    return NextResponse.json(
      { error: "Brak workflowId" },
      { status: 400 }
    );
  }

  const res = await fetch("https://api.openai.com/v1/chatkit/sessions", {
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

  if (!res.ok) {
    console.error("Błąd tworzenia sesji ChatKit", data);
    return NextResponse.json(
      { error: "Błąd tworzenia sesji ChatKit", details: data },
      { status: res.status }
    );
  }

  return NextResponse.json({
    client_secret: data.client_secret,
  });
}
