"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { ErrorOverlay } from "./ErrorOverlay";
import type { ColorScheme } from "@/hooks/useColorScheme";
import type { FactAction } from "./FactTypes"; // jeśli nie masz, usuń ten import i użyj type inline

type ChatKitPanelProps = {
  workflow: string;                         // 👈 NOWY, obowiązkowy
  theme: ColorScheme;
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
  onThemeRequest: (scheme: ColorScheme) => void;
};

type ErrorState = {
  script: string | null;
  session: string | null;
  integration: string | null;
  retryable: boolean;
};

const isBrowser = typeof window !== "undefined";

export function ChatKitPanel({
  workflow,
  theme,
  onWidgetAction,
  onResponseEnd,
  onThemeRequest,
}: ChatKitPanelProps) {
  const processedFacts = useRef(new Set<string>());
  const [errors, setErrors] = useState<ErrorState>({
    script: null,
    session: null,
    integration: null,
    retryable: false,
  });

  const [isInitializingSession, setIsInitializingSession] = useState(true);
  const isMountedRef = useRef(true);

  const [scriptStatus, setScriptStatus] = useState<
    "pending" | "ready" | "error"
  >(() =>
    isBrowser && window.customElements?.get("openai-chatkit")
      ? "ready"
      : "pending"
  );

  const [widgetInstanceKey, setWidgetInstanceKey] = useState(0);

  const setErrorState = useCallback((updates: Partial<ErrorState>) => {
    setErrors((current) => ({ ...current, ...updates }));
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 👉 Load ChatKit widget script
  useEffect(() => {
    if (!isBrowser) return;

    let timeoutId: number | undefined;

    const handleLoaded = () => {
      if (!isMountedRef.current) return;
      setScriptStatus("ready");
      setErrorState({ script: null });
    };

    const handleError = (event: Event) => {
      console.error("Failed to load chatkit.js", event);
      if (!isMountedRef.current) return;
      setScriptStatus("error");
      setErrorState({
        script: "ChatKit script failed to load.",
        retryable: false,
      });
      setIsInitializingSession(false);
    };

    window.addEventListener("chatkit-script-loaded", handleLoaded);
    window.addEventListener(
      "chatkit-script-error",
      handleError as EventListener
    );

    if (window.customElements?.get("openai-chatkit")) {
      handleLoaded();
    } else if (scriptStatus === "pending") {
      timeoutId = window.setTimeout(() => {
        if (!window.customElements?.get("openai-chatkit")) {
          handleError(
            new CustomEvent("chatkit-script-error", {
              detail: "ChatKit not available.",
            })
          );
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener("chatkit-script-loaded", handleLoaded);
      window.removeEventListener(
        "chatkit-script-error",
        handleError as EventListener
      );
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [scriptStatus, setErrorState]);

  // 👉 Initialize Hosted Session
  const getClientSecret = useCallback(
    async (currentSecret: string | null) => {
      if (!workflow) {
        setErrorState({
          session: "Missing workflow id.",
          retryable: false,
        });
        setIsInitializingSession(false);
        throw new Error("Missing workflow id.");
      }

      if (isMountedRef.current && !currentSecret) {
        setIsInitializingSession(true);
      }

      try {
        const response = await fetch("/api/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflow: { id: workflow },     // 👈 Dynamic workflow
            chatkit_configuration: {
              file_upload: { enabled: true },
            },
          }),
        });

        const raw = await response.text();
        let data: any = {};
        try {
          data = JSON.parse(raw);
        } catch {}

        if (!response.ok) {
          throw new Error(data?.error || "Failed to get session secret.");
        }

        const clientSecret =
          data?.client_secret || data?.session?.client_secret;

        if (!clientSecret) {
          throw new Error("Missing client_secret in response.");
        }

        setErrorState({ session: null, integration: null });
        return clientSecret;
      } catch (err: any) {
        console.error("Failed to create ChatKit session", err);
        setErrorState({ session: err.message, retryable: false });
        throw err;
      } finally {
        if (isMountedRef.current && !currentSecret) {
          setIsInitializingSession(false);
        }
      }
    },
    [workflow, setErrorState]
  );

  // 👉 Initialize ChatKit UI
  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: { colorScheme: theme },
    startScreen: {
      greeting: "Jak mogę pomóc?",
      prompts: [{ label: "Co możesz zrobić?", prompt: "Co możesz zrobić?" }],
    },
    composer: { placeholder: "Zadaj pytanie...", attachments: { enabled: true } },
    onClientTool: async () => ({ success: true }),
    onResponseEnd,
    onThreadChange: () => processedFacts.current.clear(),
    onError: ({ error }) => console.error("ChatKit error", error),
  });

  const blockingError =
    errors.script || errors.session || errors.integration;

  return (
    <div className="relative pb-8 flex h-[90vh] w-full rounded-2xl flex-col overflow-hidden bg-white shadow-sm dark:bg-slate-900">
      <ChatKit
        key={widgetInstanceKey}
        control={chatkit.control}
        className={
          blockingError || isInitializingSession
            ? "pointer-events-none opacity-0"
            : "block h-full w-full"
        }
      />

      <ErrorOverlay
        error={blockingError}
        fallbackMessage={
          blockingError || !isInitializingSession
            ? null
            : "Ładowanie asystenta..."
        }
        onRetry={null}
      />
    </div>
  );
}
