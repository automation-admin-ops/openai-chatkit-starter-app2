import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  try {
    const { workflow } = await req.json();
    if (!workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow ID" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "chatgpt-4o-latest",
      extra_body: {
        session: {
          workflow_id: workflow.id,
        },
      },
    });

    return NextResponse.json({
      client_secret: response.client_secret,
    });
  } catch (error) {
    console.error("Create-session error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
