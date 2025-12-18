import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage({
  params,
}: {
  params: { topic: string };
}) {
  if (!params?.topic) {
    return <div>ERROR: missing topic</div>;
  }

  return (
    <div className="h-screen w-screen flex">
      {/* ⬇️ TU JEST JEDYNE ŹRÓDŁO PRAWDY */}
      <ChatKitPanel key={params.topic} topic={params.topic} />
    </div>
  );
}
