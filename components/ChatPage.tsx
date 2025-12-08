"use client";

import { useParams, useSearchParams } from "next/navigation";
import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("secret");

  if (!clientSecret) {
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
      <ChatKitPanel clientSecret={clientSecret} />
    </div>
  );
}
