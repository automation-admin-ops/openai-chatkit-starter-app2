"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatKitPanel({
  clientSecret,
  topic,
}: {
  clientSecret: string;
  topic: string;
}) {
  const { control } = useChatKit({
    api: {
      getClientSecret: async () => clientSecret,
    },
  });

  // 🔁 Spróbujemy odnowić client_secret jeżeli requesty 401 będą widoczne w konsoli
  const renewSecretIfExpired = () => {
    const sessionId = localStorage.getItem(`chat_session_${topic}`);
    if (!sessionId) return;

    fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.client_secret) {
          localStorage.setItem(`chat_secret_${topic}`, data.client_secret);
          window.location.href = `/chat/${topic}?secret=${data.client_secret}`;
        }
      });
  };

  // 👂 Globalnie nasłuchujemy, jeżeli API ChatKit zwróci 401
  if (typeof window !== "undefined") {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        console.warn("⚠️ wygasło — odnawiam client_secret...");
        renewSecretIfExpired();
      }
      return response;
    };
  }

  return <ChatKit control={control} className="w-full h-full" />;
}
