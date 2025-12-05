"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage({
  params,
}: {
  params: { topic: string };
}) {
  const validTopics: Record<string, string> = {
    dofinansowania: "wf_6932ac799e9881909bdcda1aad5227a40f71ef9303cd9786",
    ogol: "wf_68e61c674c7c81908108f731ff8052260f55d9779aac7dae",
  };

  const workflowId = validTopics[params.topic];

  if (!workflowId) {
    return <div>⚠️ Niepoprawny temat chatu.</div>;
  }

  return <ChatKitPanel workflow={{ id: workflowId }} />;
}
