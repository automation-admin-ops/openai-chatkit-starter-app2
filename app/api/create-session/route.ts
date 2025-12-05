import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.workflow?.id) {
      return NextResponse.json(
        { error: "Missing required parameter: 'workflow.id'." },
        { status: 400 }
      );
    }

    const result = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "ChatKit hosted session init" },
        { role: "user", content: "initialize" },
      ],
    });

    const session = await client.chatkit.sessions.create({
      user: "public_user",
      workflow_id: body.workflow.id,
    });

    return NextResponse.json({
      client_secret: session.client_secret,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
