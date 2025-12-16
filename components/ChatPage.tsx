import ChatKitPanel from "./ChatKitPanel";

export default function ChatPage({
  topic,
}: {
  topic: "general" | "grants";
}) {
  return (
    <div className="h-full">
      <ChatKitPanel chatType={topic} />
    </div>
  );
}
