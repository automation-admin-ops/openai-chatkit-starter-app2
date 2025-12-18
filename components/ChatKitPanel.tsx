"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatTopic } from "@/lib/chat";

export default function ChatKitPanel({ topic }: { topic: ChatTopic }) {
  const control = useChatKit();

  return (
    <ChatKit
      control={control}
      endpoint={`/api/create-session/${topic}`}
      className="h-full w-full"
    />
  );
}
