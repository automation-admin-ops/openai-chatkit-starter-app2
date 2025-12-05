"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function ChatKitPanel({ workflow }: { workflow: { id: string } }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  /** CREATE SESSION */
  const createSession = useCallback(async () => {
    const res = await fetch("/api/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow }),
    });

    if (!res.ok) {
      console.error("❌ Failed to create session");
      return;
    }

    const data = await res.json();
    setSessionId(data.session_id);
  }, [workflow]);

  /** INIT WIDGET WHEN SESSION GENERATED */
  useEffect(() => {
    if (!sessionId || !containerRef.current) return;

    // Load JS SDK
    const script = document.createElement("script");
    script.src = "https://cdn.openai.com/chatkit/v1/chatkit.js";
    script.async = true;

    script.onload = () => {
      // @ts-expect-error because ChatKit is a global
      if (window.ChatKit) {
        // @ts-expect-error global
        window.ChatKit.mount({
          element: containerRef.current,
          sessionId,
          theme: {
            darkMode: false,
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [sessionId]);

  /** INIT ON FIRST RENDER */
  useEffect(() => {
    if (!sessionId) createSession();
  }, [sessionId, createSession]);

  return (
    <div className="chat-panel" style={{ width: "100%", height: "100%" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "calc(100vh - 80px)",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      ></div>
    </div>
  );
}
