"use client";

import { useEffect, useRef } from "react";
import { ChatKit } from "@openai/chatkit-react";

interface ChatKitPanelProps {
  workflow: { id: string };
  topic: string;
}

export default function ChatKitPanel({ workflow, topic }: ChatKitPanelProps) {
  // Klucz historii tylko dla tego typu chatu
  const widgetKey = `chatkit_${topic}`;

  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // reset widżetu po zmianie kategorii
    if (widgetRef.current) {
      widgetRef.current.innerHTML = "";
    }
  }, [topic]);

  return (
    <div ref={widgetRef} className="w-full h-[90vh]">
      <ChatKit
        apiKey="client"
        options={{
          api: {
            getClientSecret: async () => {
              const res = await fetch("/api/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workflow, topic }),
              });
              if (!res.ok) throw new Error("Failed to create session");
              const data = await res.json();
              return data.clientSecret;
            },
          },
          widget: {
            historySyncKey: widgetKey, // 🧠 oddzielna historia
            // DARK THEME nadal aktywny poprzez CSS (global styling)
          },
        }}
      />
    </div>
  );
}
