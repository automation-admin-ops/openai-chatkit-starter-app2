/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.workflow?.id) {
      return NextResponse.json(
        { error: "Missing required parameter: workflow.id" },
        { status: 400 }
      );
    }

    // 🔐 wymagany user (globalny / publiczny)
    const userId = "public_user";

    // 🔥 Tworzymy sesję ChatKit
    const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1", // ⚠️ ważne
      },
      body: JSON.stringify({
        user: userId,
        workflow_id: body.workflow.id,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("ChatKit session error:", err);
      return NextResponse.json(err, { status: 500 });
    }

    const result = await response.json();

    if (!result.client_secret) {
      return NextResponse.json(
        { error: "Missing client secret in response from OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      client_secret: result.client_secret,
      user: userId,
    });
  } catch (error: any) {
    console.error("Unexpected server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
