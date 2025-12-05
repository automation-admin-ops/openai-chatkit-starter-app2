import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { workflow } = await req.json();

    if (!workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow id." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // 👇 PROPER hosted chatkit session
    const result = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      extra_headers: {
        "OpenAI-ChatKit-Hosted": "session",
      },
      // 👇 pay attention: properly nested session config
      extra_body: {
        session: {
          workflow_id: workflow.id,
        },
      },
      messages: [
        {
          role: "system",
          content: "Initialize workflow session.",
        },
      ],
    });

    const clientSecret =
      result?.client_secret || result?.session?.client_secret;

    if (!clientSecret) {
      return NextResponse.json(
        { error: "Failed to retrieve client_secret from OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ client_secret: clientSecret });
  } catch (e) {
    console.error("SESSION ERROR:", e);
    return NextResponse.json({ error: "Internal session error." }, { status: 500 });
  }
}
