/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { workflow } = await req.json();

    if (!workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow id." },
        { status: 400 }
      );
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return NextResponse.json(
        { error: "Missing API key." },
        { status: 500 }
      );
    }

    // 👉 Temporary user string - later dynamic (e.g. Basecamp ID)
    const userId = "guest-user";

    const resp = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
        "OpenAI-Beta": "chatkit_beta=v1"
      },
      body: JSON.stringify({
        user: userId,            // ⭐ MUST be string
        workflow: { id: workflow.id }
      }),
    });

    const text = await resp.text();

    if (!resp.ok) {
      console.error("ChatKit session error:", resp.status, text);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json({ client_secret: data.client_secret });
  } catch (e) {
    console.error("SESSION ERROR:", e);
    return NextResponse.json(
      { error: "Internal session error." },
      { status: 500 }
    );
  }
}
