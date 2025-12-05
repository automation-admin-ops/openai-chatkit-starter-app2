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

    const userId = `public-${workflow.id}`;

    // 🔥 Hosted ChatKit (bez extra_body!)
    const response = await fetch("https://api.openai.com/v1/chatkit/create_session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // API key
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

        // Wymagane nagłówki ChatKit
        "OpenAI-Beta": "chatkit_beta=v1",
        "OpenAI-ChatKit-Hosted": "session",

        // Identyfikacja sesji
        "X-OpenAI-ChatKit-User": userId,
        "X-OpenAI-ChatKit-Workflow": workflow.id,
      },
      body: JSON.stringify({
        file_upload: { enabled: true },      // opcjonalne
      }),
    });

    const result = await response.json();

    // Fail
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

    // Success
    return NextResponse.json({ client_secret: result.client_secret });

  } catch (error) {
    console.error("ChatKit session error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
