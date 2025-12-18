"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatKitPanel({ topic }: { topic: string }) {
  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        const res = await fetch(`/api/create-session/${topic}`, {
          method: "POST",
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to create session");
        }

        const data = await res.json();
        return data.client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-full w-full" />;
}
