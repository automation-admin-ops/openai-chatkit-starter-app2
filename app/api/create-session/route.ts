import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // wymagane pole z workflow (ID musi przyjść z frontu)
    if (!body?.workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow.id" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // Tworzymy interaktywną sesję ChatKit z API
    const session = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "ChatKit hosted session init" },
        { role: "user", content: "initialize" },
      ],
      stream: false,
    });

    return NextResponse.json({
      session_id: session.id,
      workflow: body.workflow.id,
    });
  } catch (err) {
    console.error("❌ Session error:", err);
    return NextResponse.json(
      { error: "Internal error creating session" },
      { status: 500 }
    );
  }
}
