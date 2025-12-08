"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function start(topic: string, workflowId: string) {
    // Sprawdź czy istnieje zapisana sesja dla tego tematu
    const saved = localStorage.getItem(`chat_secret_${topic}`);
    if (saved) {
      router.push(`/chat/${topic}?secret=${saved}`);
      return;
    }

    // Jeśli nie ma zapisanej sesji → tworzymy nową
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowId }),
    });

    const data = await res.json();

    if (data?.client_secret) {
      // zapisujemy client secret
      localStorage.setItem(`chat_secret_${topic}`, data.client_secret);
      router.push(`/chat/${topic}?secret=${encodeURIComponent(data.client_secret)}`);
    } else {
      alert("❌ Błąd podczas tworzenia czatu");
    }
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
