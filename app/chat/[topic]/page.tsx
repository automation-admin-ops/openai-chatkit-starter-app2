"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const workflow = { id: topic };

  return (
    <div className="w-full h-full">
      <ChatKitPanel workflow={workflow} />
    </div>
  );
}
