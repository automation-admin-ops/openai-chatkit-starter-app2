import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const workflow = body?.workflow;
    if (!workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow.id in request body." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      defaultHeaders: {
        // 🔑 wymagane do Hosted Mode
        "OpenAI-Beta": "chatkit_beta=v1",
      },
    });

    // 🟢 PUBLICZNA historia per workflow
    const userId = `public-${workflow.id}`;

    const result = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant accessible from a public anonymous session.",
        },
        { role: "user", content: "initialize" },
      ],
      // 🧩 Konfiguracja Hosted Session
      session: {
        // 👇 najważniejsze — unikalny user per workflow
        user: userId,
        workflow_id: workflow.id,
      },
    });

    const clientSecret = (result as any)?.client_secret;
    if (!clientSecret || typeof clientSecret !== "string") {
      return NextResponse.json(
        { error: "Missing client secret in ChatKit response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ client_secret: clientSecret });
  } catch (error: any) {
    console.error("ChatKit session error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unknown error while creating ChatKit session. Check server logs.",
      },
      { status: 500 }
    );
  }
}
