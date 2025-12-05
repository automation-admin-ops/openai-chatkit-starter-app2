import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const body: { workflow?: { id: string } } = await req.json();

    if (!body?.workflow?.id) {
      return NextResponse.json(
        { error: "Missing required parameter: 'workflow.id'" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      defaultHeaders: {
        "OpenAI-Beta": "chatkit_beta=v1",
      },
    });

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Create ChatKit hosted session." },
        { role: "user", content: "initialize" },
      ],
      extra_body: {
        session: {
          user: "public_user",
          workflow_id: body.workflow.id,
        },
      },
    });

    return NextResponse.json({
      client_secret: response.client_secret,
    });
  } catch (err) {
    console.error("ChatKit session error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
