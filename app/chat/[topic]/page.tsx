"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatPage() {
  const { control, status } = useChatKit({
    api: {
      async getClientSecret() {
        const res = await fetch("/api/create-session/general", {
          method: "POST",
        });
        const data = await res.json();
        return data.client_secret;
      },
    },
  });

  return (
    <div style={{ minHeight: "100vh", padding: 20 }}>
      <h1>STATUS: {status}</h1>

      {status === "ready" ? (
        <ChatKit control={control} />
      ) : (
        <p>Initializing ChatKit…</p>
      )}
    </div>
  );
}
