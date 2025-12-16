"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatKitPanel({
  chatType,
}: {
  chatType: "general" | "grants";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // 🔹 wczytaj historię z Redis
  useEffect(() => {
    fetch(`/api/chat/history?chatType=${chatType}`)
      .then((r) => r.json())
      .then(setMessages);
  }, [chatType]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    // 🔹 zapisz do Redis
    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatType,
        message: userMessage,
      }),
    });

    // 🔹 ChatKit dalej odpowiada jak wcześniej (frontend)
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-2 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <b>{m.role === "user" ? "Ty" : "Bot"}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-4 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-2 py-1"
          placeholder="Napisz wiadomość…"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 border rounded"
        >
          Wyślij
        </button>
      </div>
    </div>
  );
}
