"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface ChatKitPanelProps {
  workflow: { id: string };
}

declare global {
  interface Window {
    ChatKit: {
      createWidget: (options: {
        element: HTMLElement;
        clientSecret: string;
        workflowId: string;
      }) => void;
    };
  }
}

export default function ChatKitPanel({ workflow }: ChatKitPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  /** Fetch client secret from our Next.js API */
  const createSession = async (workflowId: string): Promise<void> => {
    try {
      const res = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow }),
      });

      if (!res.ok) {
        console.error("Failed to fetch session", await res.text());
        return;
      }

      const data = await res.json();
      setClientSecret(data.client_secret);
    } catch (error) {
      console.error("Session error:", error);
    }
  };

  /** Run session creation ONCE */
  useEffect(() => {
    if (workflow?.id) createSession(workflow.id);
  }, [workflow.id]);

  /** After ChatKit script loads, create widget */
  useEffect(() => {
    if (!clientSecret) return;
    if (!containerRef.current) return;
    if (!window.ChatKit || !window.ChatKit.createWidget) return;

    window.ChatKit.createWidget({
      element: containerRef.current,
      clientSecret,
      workflowId: workflow.id,
    });
  }, [clientSecret, workflow.id]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Load ChatKit JS */}
      <Script
        src="https://cdn.openai.com/chatkit/v1/chatkit.js"
        strategy="lazyOnload"
      />
      {/* Chat container */}
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}
