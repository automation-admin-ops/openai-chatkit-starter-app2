"use client";

import { ChatKit } from "@openai/chatkit-react";

export default function ChatKitPanel({
  clientSecret,
}: {
  clientSecret: string;
}) {
  return <ChatKit clientSecret={clientSecret} />;
}
