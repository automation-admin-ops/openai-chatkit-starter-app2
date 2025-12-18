import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage({
  params,
}: {
  params: { topic: string };
}) {
  return (
    <div className="h-screen w-screen flex">
      {/* 🔑 key WYMUSZA odmontowanie ChatKit przy zmianie topic */}
      <ChatKitPanel key={params.topic} topic={params.topic} />
    </div>
  );
}
