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
    <div className="h-screen w-screen">
      {/* ⬇️ przekazujemy topic do CLIENT COMPONENT */}
      <ChatKitPanel topic={params.topic} />
    </div>
  );
}
