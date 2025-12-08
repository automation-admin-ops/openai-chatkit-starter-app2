"use client";

import { useRouter } from "next/navigation";

function isLikelyValidClientSecret(secret: string | null): secret is string {
  if (!secret) return false;
  // ChatKit zwraca coś w stylu "chatkit_token_..."
  return secret.startsWith("chatkit_");
}

export default function HomePage() {
  const router = useRouter();

  async function start(topic: string, workflowId: string) {
    if (!workflowId) {
      console.error("Brak workflowId dla topic:", topic);
      alert("Brak workflowId w konfiguracji. Sprawdź zmienne środowiskowe.");
      return;
    }

    // 🔁 Spróbuj użyć wcześniejszego client_secret (dopóki ważny)
    let savedSecret: string | null = null;
    if (typeof window !== "undefined") {
      savedSecret = window.localStorage.getItem(`chat_secret_${topic}`);
    }

    if (isLikelyValidClientSecret(savedSecret)) {
      router.push(`/chat/${topic}?secret=${encodeURIComponent(savedSecret)}`);
      return;
    } else if (typeof window !== "undefined") {
      // wyczyść śmieci po poprzednich eksperymentach
      window.localStorage.removeItem(`chat_secret_${topic}`);
    }

    // 🆕 Tworzymy nową sesję
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowId }),
    });

    const data = await res.json();

    if (!res.ok || !data?.client_secret) {
      console.error("Nie udało się stworzyć sesji:", data);
      alert("Nie udało się uruchomić czatu. Spróbuj ponownie.");
      return;
    }

    const clientSecret: string = data.client_secret;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(`chat_secret_${topic}`, clientSecret);
    }

    router.push(`/chat/${topic}?secret=${encodeURIComponent(clientSecret)}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Wybierz chat 👇</h1>

      <div className="flex gap-6">
        <button
          type="button"
          className="rounded-full bg-blue-600 px-6 py-3 text-xl text-white"
          onClick={() =>
            start(
              "dofinansowania",
              process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_DOF ?? ""
            )
          }
        >
          💸 Dofinansowania
        </button>

        <button
          type="button"
          className="rounded-full bg-green-600 px-6 py-3 text-xl text-white"
          onClick={() =>
            start(
              "ogolny",
              process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_OGOLNY ?? ""
            )
          }
        >
          💬 Ogólny
        </button>
      </div>
    </main>
  );
}
