"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatTopicPage(props: any) {
  const topic = props.params?.topic;

  const WORKFLOWS: Record<string, { id: string }> = {
    dofinansowania: { id: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_DOF! },
    ogolny: { id: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_OGOL! },
  };

  const workflow = WORKFLOWS[topic];

  if (!workflow) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <h1 className="text-2xl font-bold">❌ Nie znaleziono asystenta</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-5xl mt-8">
        <ChatKitPanel workflow={workflow} />
      </div>
    </main>
  );
}
