"use client";

export default function Home() {
  // 🔵 ZDEFINIUJ swoje workflow ID — z OpenAI Agent Builder
  const WORKFLOWS = {
    dofinansowania: "WF_ID_DO_DOFINANSOWANIA",
    ogolny: "WF_ID_OGOLNY"
  };

  async function startChat(workflowId: string) {
    const response = await fetch("/api/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ workflow: workflowId })
    });

    if (!response.ok) {
      alert("Błąd podczas tworzenia sesji. Sprawdź konsolę.");
      console.error(await response.text());
      return;
    }

    const session = await response.json();

    // 🔵 przekierowanie do strony chatu
    window.location.href = `/chat?session=${session.id}`;
  }

  return (
    <main className="flex flex-col items-center justify-center gap-10 min-h-screen">
      <h1 className="text-4xl font-bold">Wybierz, czego potrzebujesz 👇</h1>

      <div className="flex gap-8">
        <button
          className="rounded-full p-10 bg-blue-500 text-white text-xl hover:bg-blue-600 transition cursor-pointer"
          onClick={() => startChat(WORKFLOWS.dofinansowania)}
        >
          💸 Dofinansowania
        </button>

        <button
          className="rounded-full p-10 bg-green-500 text-white text-xl hover:bg-green-600 transition cursor-pointer"
          onClick={() => startChat(WORKFLOWS.ogolny)}
        >
          💬 Ogólny konsultant
        </button>
      </div>
    </main>
  );
}
