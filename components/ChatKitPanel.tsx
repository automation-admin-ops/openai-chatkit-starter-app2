"use client";

import { useEffect, useRef } from "react";

// ChatKit global loaded from CDN
declare global {
  interface Window {
    ChatKit: any;
  }
}

interface ChatKitPanelProps {
  workflow: { id: string };
}

export default function ChatKitPanel({ workflow }: ChatKitPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function createSession() {
      if (!containerRef.current) return;

      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow }),
      });

      const data = await res.json();

      if (!data?.client_secret) {
        console.error("Missing client secret in response from OpenAI.");
        return;
      }

      const chat = new window.ChatKit({
        clientSecret: data.client_secret,
        element: containerRef.current,
        theme: "light",
      });

      chat.mount();
    }

    createSession();
  }, [workflow]);

  return <div ref={containerRef} style={{ height: "100vh", width: "100%" }} />;
}
