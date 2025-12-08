"use client";

import { useSearchParams, useParams } from "next/navigation";
import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatTopicPage() {
  const { topic } = useParams();
  const params = useSearchParams();
  const secret = params.get("secret");

  if (!secret) {
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
      <ChatKitPanel clientSecret={secret} />
    </div>
  );
}
