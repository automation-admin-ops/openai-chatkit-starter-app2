import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.workflow?.id) {
      return NextResponse.json(
        { error: "Missing workflow id" },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1" // REQUIRED
      },
      body: JSON.stringify({
        user: "public_user",            // każdy widzi historię
        workflow_id: body.workflow.id,  // Twój workflow
      }),
    });

    const data = await res.json();

    if (!res.ok || !data?.client_secret) {
      console.error("ChatKit session error:", data);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    return NextResponse.json({ client_secret: data.client_secret });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
