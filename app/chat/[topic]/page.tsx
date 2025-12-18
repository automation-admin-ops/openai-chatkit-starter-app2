import ChatKitPanel from "@/components/ChatKitPanel";
import type { ChatTopic } from "@/lib/chat";

export default function ChatPage({
  params,
}: {
  params: { topic: ChatTopic };
}) {
  return (
    <div className="h-screen w-screen">
      <ChatKitPanel topic={params.topic} />
    </div>
  );
}
