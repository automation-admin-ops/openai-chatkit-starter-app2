import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage({
  params,
}: {
  params: { topic: string };
}) {
  return (
    <div className="h-screen w-screen flex">
      <ChatKitPanel topic={params.topic as any} />
    </div>
  );
}
