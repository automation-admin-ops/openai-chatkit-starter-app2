import { redirect } from "next/navigation";
import ChatKitPanel from "@/components/ChatKitPanel";
import { isChatTopic } from "@/lib/chat";

export default function Page({
  params,
}: {
  params: { topic: string };
}) {
  if (!isChatTopic(params.topic)) {
    redirect("/");
  }

  return (
    <main className="h-screen w-full">
      <ChatKitPanel topic={params.topic} />
    </main>
  );
}
