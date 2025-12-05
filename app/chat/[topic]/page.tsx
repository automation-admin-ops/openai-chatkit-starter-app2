import ChatPage from "@/components/ChatPage";

export default function Page({ params }: any) {
  return <ChatPage topic={params.topic} />;
}
