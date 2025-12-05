"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

const WORKFLOWS: Record<string, { id: string }> = {
  dofinansowania: { id: "wf_6932ac799e9881909bdcda1aad5227a40f71ef9303cd9786" },
  ogolny: { id: "wf_68e61c674c7c81908108f731ff8052260f55d9779aac7dae" },
};

export default function Page({ params }: { params: { topic: string } }) {
  const workflow = WORKFLOWS[params.topic] ?? WORKFLOWS.ogolny;

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <ChatKitPanel workflow={workflow} />
      </div>
    </main>
  );
}
