"use client";
import ChatKitPanel from "@/components/ChatKitPanel";

interface ChatPageProps {
  params: { topic: string };
}

export default function ChatPage({ params }: ChatPageProps) {
  const workflows: Record<string, string> = {
    dofinansowania: "wf_6932ac799e9881909bdcda1aad5227a40f71ef9303cd9786",
    ogolny: "wf_68e61c674c7c81908108f731ff8052260f55d9779aac7dae",
  };

  const workflowId = workflows[params.topic];

  if (!workflowId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-100 text-red-800">
        <div>❌ Nie znaleziono takiego asystenta.</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <ChatKitPanel workflow={{ id: workflowId }} />
      </div>
    </main>
  );
}
