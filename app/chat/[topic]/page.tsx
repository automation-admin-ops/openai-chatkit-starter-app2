"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

export default function Page({ params }: { params: { topic: string } }) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <ChatKitPanel workflow={{ id: params.topic }} />
    </div>
  );
}
