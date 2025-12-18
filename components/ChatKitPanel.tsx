"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatTopic } from "@/lib/chat";

export default function ChatKitPanel({ topic }: { topic: ChatTopic }) {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) return existing;

        const res = await fetch(`/api/create-session/${topic}`, {
          method: "POST",
        });

        if (!res.ok) {
          throw new Error("Failed to create ChatKit session");
        }

        const data = await res.json();
        return data.client_secret;
      },
    },
  });

  return (
    <div className="flex-1 h-full w-full">
      <ChatKit control={control} />
    </div>
  );
}
