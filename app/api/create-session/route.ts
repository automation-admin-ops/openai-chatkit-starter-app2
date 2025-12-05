import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type WorkflowData = {
  id: string;
};

type CreateSessionBody = {
  workflow?: WorkflowData;
};

type ChatKitResponse = {
  client_secret?: string;
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

    // 🟢 PUBLICZNY identyfikator historii per workflow
    const userId: string = `public-${workflow.id}`;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      defaultHeaders: {
        "OpenAI-Beta": "chatkit_beta=v1",
        "OpenAI-ChatKit-Hosted": "session",
        "X-OpenAI-ChatKit-User": userId,
        "X-OpenAI-ChatKit-Workflow": workflow.id,
      },
    });

    const result = (await client.chat.completions.create(
      {
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "Initialize chat session." },
          { role: "user", content: "init" },
        ],
      },
      {
        // 🧠 👇 Tutaj umieszczamy session → TRIGGER HOSTED
        extra_body: {
          session: {
            user: userId,
            workflow_id: workflow.id,
          },
        },
      }
    )) as unknown as ChatKitResponse;

    const clientSecret = result.client_secret;
    if (!clientSecret || typeof clientSecret !== "string") {
      return NextResponse.json(
        { error: "Missing client secret in response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ client_secret: clientSecret });
  } catch (error) {
    console.error("ChatKit session error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
