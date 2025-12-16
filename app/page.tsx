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
        router.push(`/chat/${chatType}?secret=${data.client_secret}`);
        return;
      }

      // fallback
      localStorage.removeItem(sessionKey);
      localStorage.removeItem(secretKey);
    }

    // 🆕 nowa sesja
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
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>
        Wybierz chat
      </h1>

      <div style={{ display: "flex", gap: 20 }}>
        <button
          onClick={() => start("general")}
          style={buttonStyle}
        >
          💬 Ogólny
        </button>

        <button
          onClick={() => start("dofinansowania")}
          style={buttonStyle}
        >
          💰 Dofinansowania
        </button>
      </div>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "14px 22px",
  fontSize: 16,
  borderRadius: 10,
  border: "1px solid #ccc",
  cursor: "pointer",
  background: "#fff",
  transition: "all 0.2s ease",
};
