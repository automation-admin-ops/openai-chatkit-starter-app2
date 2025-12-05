import ChatPage from "@/components/ChatPage";

export default function Page({ params }: { params: { topic: string } }) {
  return <ChatPage topic={params.topic} />;
}
