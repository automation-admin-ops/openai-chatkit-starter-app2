"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function start(topic: string, workflowId: string) {
    const savedSession = localStorage.getItem(`chat_session_${topic}`);

    // Jeśli mamy wcześniejszą sesję → pobieramy nowy secret
    if (savedSession) {
      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: savedSession }),
      });

      const data = await res.json();
      localStorage.setItem(`chat_secret_${topic}`, data.client_secret);
      router.push(`/chat/${topic}?secret=${data.client_secret}`);
      return;
    }

    // Jeśli nie mamy sesji → tworzymy nową
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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-3xl font-bold">Wybierz chat 👇</h1>

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full text-xl"
        onClick={() =>
          start("dofinansowania", process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_DOF!)
        }
      >
        💸 Dofinansowania
      </button>

      <button
        className="bg-green-600 text-white px-6 py-3 rounded-full text-xl"
        onClick={() =>
          start("ogolny", process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_OGOLNY!)
        }
      >
        💬 Ogólny
      </button>
    </main>
  );
}
