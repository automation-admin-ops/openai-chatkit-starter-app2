"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatTopic } from "@/lib/chat";

export default function ChatKitPanel({ topic }: { topic: ChatTopic }) {
  const control = useChatKit({
    endpoint: `/api/create-session/${topic}`,
  });

  return (
    <ChatKit
      control={control}
      className="h-full w-full"
    />
  );
}
