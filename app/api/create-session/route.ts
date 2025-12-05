import { NextRequest, NextResponse } from "next/server";

type WorkflowData = { id: string };
type CreateSessionBody = { workflow?: WorkflowData };

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

    // 🟢 Publiczny user per kategoria (historia wspólna)
    const userId = `public-${workflow.id}`;

    // 🟤 Tworzymy sesję ChatKit przez dedykowany endpoint
    const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // klucz API
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,

        // wymagany header
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify({
        session: {
          user: userId,
          workflow_id: workflow.id,
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
      console.error("Session created without client_secret:", result);
      return NextResponse.json(
        { error: "Missing client secret in response from OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ client_secret: result.client_secret });

  } catch (error) {
    console.error("ChatKit session error:", error);
    return NextResponse.json({ error: "Unexpected backend error" }, { status: 500 });
  }
}
