import ChatKitPanel from "@/components/ChatKitPanel";
import type { ChatTopic } from "@/lib/chat";

export default function Page({
  params,
}: {
  params: { topic: ChatTopic };
}) {
  return <ChatKitPanel topic={params.topic} />;
}
