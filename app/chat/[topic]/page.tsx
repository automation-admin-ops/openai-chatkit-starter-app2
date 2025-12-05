"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage({ params }: { params: { topic: string } }) {
  const topic = params.topic;
  const workflow = { id: topic };

  return (
    <div className="w-full h-full">
      <ChatKitPanel workflow={workflow} />
    </div>
  );
}
