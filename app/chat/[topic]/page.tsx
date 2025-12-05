"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

interface PageProps {
  params: { topic: string };
}

const WORKFLOWS: Record<string, string> = {
  dofinansowania: "wf_6932ac799e9881909bdcda1aad5227a40f71ef9303cd9786",
  ogolny: "wf_68e61c674c7c81908108f731ff8052260f55d9779aac7dae",
};

export default function Page({ params }: PageProps) {
  const topic = params.topic;

  const workflowId = WORKFLOWS[topic] ?? WORKFLOWS.ogolny;

  return (
    <main className="w-full h-screen bg-slate-950 text-white">
      <ChatKitPanel workflow={{ id: workflowId }} topic={topic} />
    </main>
  );
}
