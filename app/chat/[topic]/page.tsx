"use client";

import { Chat } from "@openai/chatkit/client"; // 👈 KLUCZOWA ZMIANA
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const params = useSearchParams();
  const sessionId = params.get("session");

  if (!sessionId) {
    return <p>❌ Brak sesji. Wróć na stronę główną.</p>;
  }

  return (
    <div className="h-screen">
      <Chat
        session={sessionId}
        theme="light"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
