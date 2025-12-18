"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { getThemeConfig } from "@/lib/config";
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
          throw new Error("Failed to create session");
        }

        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  return (
    <ChatKit
      control={control}
      ui={getThemeConfig()}   // ⬅️ TU JEST JEDYNE WŁAŚCIWE MIEJSCE
      className="h-full w-full"
    />
  );
}
