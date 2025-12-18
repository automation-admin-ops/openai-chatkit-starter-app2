import ChatKitPanel from "@/components/ChatKitPanel";
import type { ChatTopic } from "@/lib/chat";

export default function ChatPage({ topic }: { topic: ChatTopic }) {
  return <ChatKitPanel topic={topic} />;
}
