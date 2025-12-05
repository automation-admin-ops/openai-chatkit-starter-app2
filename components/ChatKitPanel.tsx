"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChatKitWidget, ColorScheme } from "@openai/chatkit-react";

interface ChatKitPanelProps {
  workflow: { id: string };
}

export default function ChatKitPanel({ workflow }: ChatKitPanelProps) {
  const widgetRef = useRef<ChatKitWidget | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState<ColorScheme>("light");

  const createSession = useCallback(async () => {
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow }),
    });

    if (!res.ok) {
      console.error("Failed to create session:", await res.text());
      throw new Error("Failed to create session");
    }

    return res.json();
  }, [workflow]);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      try {
        const { client_secret } = await createSession();

        // ⛔ NIE importujemy createChatKit — ładujemy z hosta OpenAI
        const { createChatKit } = await import("https://cdn.openai.com/chatkit/v1/chatkit.js");

        const instance = await createChatKit({
          theme,
          api: {
            getClientSecret: async () => client_secret,
          },
        });

        if (!destroyed) {
          widgetRef.current = instance;
        }

        if (containerRef.current) {
          instance.mount(containerRef.current);
        }
      } catch (err) {
        console.error("ChatKit error:", err);
      }
    })();

    return () => {
      destroyed = true;
      widgetRef.current?.destroy();
    };
  }, [createSession, theme]);

  return (
    <>
      <div ref={containerRef} className="h-[85vh] w-full" />

      <div className="p-2 flex justify-end">
        <button
          className="px-4 py-2 bg-gray-800 text-white text-sm rounded"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Zmień motyw ({theme === "light" ? "🌙" : "☀️"})
        </button>
      </div>
    </>
  );
}
