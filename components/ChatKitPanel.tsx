"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatTopic } from "@/lib/chat";

export default function ChatKitPanel({ topic }: { topic: ChatTopic }) {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existingClientSecret) {
        // Na start i (opcjonalnie) na refresh pobieramy nowy client_secret.
        // Na początek możesz zawsze pobierać nowy – będzie działało.
        const res = await fetch(`/api/create-session/${topic}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ existingClientSecret }),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`create-session failed (${res.status}): ${txt}`);
        }

        const data: { client_secret: string } = await res.json();
        return data.client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-full w-full" />;
}
