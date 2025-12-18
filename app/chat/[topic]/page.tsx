import ChatKitPanel from "@/components/ChatKitPanel";
import type { ChatTopic } from "@/lib/chat";

export default function ChatPage({
  params,
}: {
  params: { topic: ChatTopic };
}) {
  return (
    <div className="min-h-screen h-screen w-screen flex">
      <ChatKitPanel topic={params.topic} />
    </div>
  );
}
