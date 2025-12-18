"use client";

import { useParams } from "next/navigation";
import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage() {
  const params = useParams();
  const topic = params?.topic;

  if (typeof topic !== "string" || !topic) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading chat…</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      {/* key wymusza remount przy zmianie topic */}
      <ChatKitPanel key={topic} topic={topic} />
    </div>
  );
}
