"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatKitPanel({
  clientSecret,
  topic,
}: {
  clientSecret: string;
  topic: string;
}) {
  const { control, error } = useChatKit({
    api: {
      getClientSecret: async () => clientSecret,
    },
  });

  // Gdy expired → pobierz nowy i odśwież się z zachowaną historią
  if (error?.status === 401) {
    const sessionId = localStorage.getItem(`chat_session_${topic}`);

    if (sessionId) {
      fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem(`chat_secret_${topic}`, data.client_secret);
          window.location.href = `/chat/${topic}?secret=${data.client_secret}`;
        });
    }
  }

  return <ChatKit control={control} className="w-full h-full" />;
}
