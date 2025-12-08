"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function start(topic: string, workflowId: string) {
    const sessionId = localStorage.getItem(`chat_session_${topic}`);

    // 🔁 Jeśli mamy sesję → pobieramy nowy secret bez utraty historii
    if (sessionId) {
      const res = await fetch("/api/refresh-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      localStorage.setItem(`chat_secret_${topic}`, data.client_secret);
      return router.push(`/chat/${topic}?secret=${data.client_secret}`);
    }

    // 🆕 Tworzymy nową sesję
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowId }),
    });

    const data = await res.json();
    localStorage.setItem(`chat_secret_${topic}`, data.client_secret);
    localStorage.setItem(`chat_session_${topic}`, data.session_id);
    router.push(`/chat/${topic}?secret=${data.client_secret}`);
  }

  return <MainButtons start={start} />;
}
