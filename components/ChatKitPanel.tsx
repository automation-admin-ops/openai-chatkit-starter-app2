"use client";

import { ChatKit } from "@openai/chatkit-react";

type Session = {
  id: string;
  client_secret: string;
};

export default function ChatKitPanel({
  session,
}: {
  session: Session;
}) {
  return <ChatKit session={session} />;
}
