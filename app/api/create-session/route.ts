import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type WorkflowData = {
  id: string;
};

type CreateSessionBody = {
  workflow?: WorkflowData;
};

type ChatKitResponseWithSecret = {
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

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      defaultHeaders: {
        "OpenAI-Beta": "chatkit_beta=v1",
      },
    });

    // 🟢 PUBLICZNA historia per workflow
    const userId: string = `public-${workflow.id}`;

    const result: ChatKitResponseWithSecret = (await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are an assistant accessible from a public anonymous session." },
        { role: "user", content: "initialize" },
      ],
      session: {
        user: userId,
        workflow_id: workflow.id,
      },
    })) as unknown as ChatKitResponseWithSecret;

    const clientSecret = result?.client_secret;
    if (!clientSecret || typeof clientSecret !== "string") {
      return NextResponse.json(
        { error: "Missing client secret in ChatKit response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ client_secret: clientSecret });
  } catch (error) {
    console.error("ChatKit session error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error while creating ChatKit session.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
