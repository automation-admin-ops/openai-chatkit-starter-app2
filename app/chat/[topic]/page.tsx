"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

export default function Page({ params }: { params: { topic: string } }) {
  const workflows: Record<string, string> = {
    dofinansowania: "wf_6932ac799e9881909bdcda1aad5227a40f71ef9303cd9786",
    ogolny: "wf_68e61c674c7c81908108f731ff8052260f55d9779aac7dae",
  };

  const workflowId = workflows[params.topic];

  if (!workflowId) {
    return (
      <div style={{ padding: 30 }}>
        <h2>❌ Nie znaleziono chatu</h2>
        <p>Sprawdź poprawność adresu URL.</p>
      </div>
    );
  }

  return <ChatKitPanel workflow={{ id: workflowId }} />;
}
