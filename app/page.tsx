"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  async function start(chatType: "general" | "dofinansowania") {
    const sessionKey = `chat_session_${chatType}`;
    const secretKey = `chat_secret_${chatType}`;

    const sessionId = localStorage.getItem(sessionKey);

    // 🔁 jeśli mamy sesję → tylko odświeżamy secret
    if (sessionId) {
      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();
      if (data?.client_secret) {
        localStorage.setItem(secretKey, data.client_secret);
        return router.push(`/chat/${chatType}?secret=${data.client_secret}`);
      }

      // fallback
      localStorage.removeItem(sessionKey);
      localStorage.removeItem(secretKey);
    }

    // 🆕 nowa sesja – backend sam dobiera workflowId
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatType }),
    });

    const data = await res.json();

    if (data?.client_secret && data?.session_id) {
      localStorage.setItem(secretKey, data.client_secret);
      localStorage.setItem(sessionKey, data.session_id);
      router.push(`/chat/${chatType}?secret=${data.client_secret}`);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Wybierz chat</h1>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => start("general")}>
          Ogólny
        </button>

        <button onClick={() => start("dofinansowania")}>
          Dofinansowania
        </button>
      </div>
    </main>
  );
}
