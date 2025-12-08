"use client";

import { useSearchParams, useParams } from "next/navigation";
import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage() {
  const { topic } = useParams();
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("secret");

  if (!clientSecret) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold text-lg">
          ❌ Brak `secret` w URL. Nie można uruchomić czatu.
        </p>
      </main>
    );
  }

  return (
    <div className="h-screen w-screen">
      <ChatKitPanel clientSecret={clientSecret} topic={String(topic)} />
    </div>
  );
}
