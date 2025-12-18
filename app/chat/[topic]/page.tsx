import ChatKitPanel from "@/components/ChatKitPanel";
import { normalizeTopic } from "@/lib/chat";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: rawTopic } = await params;
  const topic = normalizeTopic(rawTopic);

  return (
    <div className="h-[100svh] w-full">
      <ChatKitPanel topic={topic} />
    </div>
  );
}
