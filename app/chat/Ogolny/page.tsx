import ChatPage from "@/components/ChatPage";

export default function Chat({ params }: { params: { topic: string } }) {
  return <ChatPage topic={params.topic} />;
}
