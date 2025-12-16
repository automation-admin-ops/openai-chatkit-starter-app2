import ChatPage from "@/components/ChatPage";

export default function Page({
  params,
}: {
  params: { topic: string };
}) {
  const topic =
    params.topic === "dofinansowania"
      ? "grants"
      : "general";

  return <ChatPage topic={topic} />;
}
