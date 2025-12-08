import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const workflowId =
    body.workflowId ||
    process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID_OGOLNY ||
    '';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !workflowId) {
    return NextResponse.json(
      { error: 'Brak OPENAI_API_KEY lub workflow ID' },
      { status: 500 }
    );
  }

  const res = await fetch('https://api.openai.com/v1/chatkit/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'chatkit_beta=v1'
    },
    body: JSON.stringify({
      user: crypto.randomUUID(),
      workflow: { id: workflowId }
    })
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json({ client_secret: data.client_secret });
}
