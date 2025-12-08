"use client";

import { useParams, useSearchParams } from "next/navigation";
import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatTopicPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const topic = String(params.topic);
  const secret = searchParams.get("secret");

  if (!secret) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-red-600">
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
