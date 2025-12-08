import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Brak sessionId" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Brak OPENAI_API_KEY" }, { status: 500 });
  }

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

  return NextResponse.json({ client_secret: data.client_secret });
}
