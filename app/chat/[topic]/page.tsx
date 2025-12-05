/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @next/next/no-async-client-component */

"use client";

import ChatKitPanel from "@/components/ChatKitPanel";

export default function ChatPage({ params }: { params: { topic: string } }) {
  // TUTAJ MAPOWANIE ASYSTENTÓW → wklejasz ID swoich workflow
  const workflows: Record<string, string> = {
    dofinansowania: "wf_6932ac799e9881909bdcda1aad5227a40f71ef9303cd9786",
    ogolny: "wf_68e61c674c7c81908108f731ff8052260f55d9779aac7dae",
  };

  // Pobranie odpowiedniego workflow w zależności od URL
  const workflowId = workflows[params.topic];

  // Jeśli nie ma takiego workflow → komunikat błędu
  if (!workflowId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-100 text-red-800">
        ❌ Nie znaleziono takiego asystenta.
      </main>
    );
  }

  // Strona właściwa
  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <ChatKitPanel workflow={{ id: workflowId }} />
      </div>
    </main>
  );
}
