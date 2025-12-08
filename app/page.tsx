"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function start(topic: string, workflowId: string) {
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowId }),
    });

    const data = await res.json();

    if (data?.client_secret) {
      router.push(`/chat/${topic}?secret=${encodeURIComponent(data.client_secret)}`);
    } else {
      console.error("Brak client_secret:", data);
      alert("Błąd podczas tworzenia sesji.");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-3xl font-bold">Wybierz chat 👇</h1>

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full text-xl"
        onClick={() =>
          start(
            "dofinansowania",
            process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_DOF!
          )
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
