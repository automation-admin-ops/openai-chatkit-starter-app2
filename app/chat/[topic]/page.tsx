import ChatPage from "@/components/ChatPage";
import type { ChatTopic } from "@/lib/chat";

export default function Page({
  params,
}: {
  params: { topic: ChatTopic };
}) {
  return <ChatPage topic={params.topic} />;
}
