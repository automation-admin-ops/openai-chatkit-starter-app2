import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow id" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const result = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "ChatKit hosted session init" },
        { role: "user", content: "initialize" },
      ],
    }, {
      headers: {
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      session: {
        user: "public_user",         // 👤 shared
        workflow_id: body.workflow.id, // 🔁 workflow
      },
    });

    if (!result.client_secret) {
      return NextResponse.json(
        { error: "Missing client secret in response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ clientSecret: result.client_secret });
  } catch (err) {
    console.error("ChatKit session error:", err);
    return NextResponse.json(
      {
        error: "Failed to create session",
        details: err,
      },
      { status: 500 }
    );
  }
}
