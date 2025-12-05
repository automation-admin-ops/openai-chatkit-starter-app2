import { NextRequest, NextResponse } from "next/server";

type WorkflowData = {
  id: string;
};

type CreateSessionBody = {
  workflow?: WorkflowData;
};

export async function POST(req: NextRequest) {
  try {
    const body: CreateSessionBody = await req.json();
    const workflow = body?.workflow;

    if (!workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow.id in request body." },
        { status: 400 }
      );
    }

    // 🟢 Publiczny user per kategoria (wspólna historia)
    const userId = `public-${workflow.id}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // API KEY
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

        // Włączamy Hosted ChatKit
        "OpenAI-Beta": "chatkit_beta=v1",
        "OpenAI-ChatKit-Hosted": "session",

        // 🔒 Identyfikacja historii
        "X-OpenAI-ChatKit-User": userId,
        "X-OpenAI-ChatKit-Workflow": workflow.id,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",             // model nie ma znaczenia — tylko uruchamia sesję

        // Minimalna inicjalizacja
        messages: [
          { role: "system", content: "Initialize ChatKit session." }
        ],

        // Dodatkowo można włączyć upload plików
        file_upload: {
          enabled: true,
        }
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("ChatKit session error:", result);
      return NextResponse.json(
        { error: result?.error?.message ?? "Failed to create session" },
        { status: 500 }
      );
    }

    if (!result?.client_secret) {
      return NextResponse.json(
        { error: "Missing client secret in response from OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ client_secret: result.client_secret });

  } catch (error) {
    console.error("ChatKit session error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
