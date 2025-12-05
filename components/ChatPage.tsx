"use client";
import { ChatKitPanel } from "@/components/ChatKitPanel";

const WORKFLOWS: Record<string, string> = {
  dofinansowania: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_DOF!,
  ogolny: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_OGOL!,
};

export default function ChatPage({ topic }: { topic: string }) {
  const workflow = WORKFLOWS[topic];

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-white dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <ChatKitPanel
          workflow={workflow}
          theme="light"
          onWidgetAction={async () => {}}
          onResponseEnd={() => {}}
          onThemeRequest={() => {}}
        />
      </div>
    </main>
  );
}
