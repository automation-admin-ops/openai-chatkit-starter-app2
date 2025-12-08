import { NextRequest, NextResponse } from "next/server";
import { ChatKit } from "@openai/chatkit/server"; // 👈 KLUCZOWA ZMIANA

export async function POST(req: NextRequest) {
  try {
    const { workflow } = await req.json();

    if (!workflow) {
      return NextResponse.json(
        { error: "Missing workflow ID" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment" },
        { status: 500 }
      );
    }

    const ck = new ChatKit({
      apiKey: process.env.OPENAI_API_KEY
    });

    const session = await ck.sessions.create({
      workflow
    });

    return NextResponse.json(session);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
