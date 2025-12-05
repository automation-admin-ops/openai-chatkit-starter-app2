import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { workflow } = await req.json();
    if (!workflow?.id) {
      return NextResponse.json({ error: "Missing workflow id." }, { status: 400 });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return NextResponse.json({ error: "Missing API key." }, { status: 500 });
    }

    const resp = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        workflow: { id: workflow.id },
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error("ChatKit session error:", resp.status, body);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    const data = await resp.json();
    return NextResponse.json({ client_secret: data.client_secret });
  } catch (e) {
    console.error("SESSION ERROR:", e);
    return NextResponse.json({ error: "Internal session error." }, { status: 500 });
  }
}
