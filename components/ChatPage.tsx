"use client";
import { ChatKitPanel } from "@/components/ChatKitPanel";

type Props = { topic: string };

const WORKFLOWS: Record<string, string> = {
  dofinansowania: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_DOF!,
  ogolny: process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_OGOL!,
};

export default function ChatPage({ topic }: Props) {
  const workflow = WORKFLOWS[topic];

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl">
        <ChatKitPanel
  		workflow={workflow}
  		theme={"light"}                 // lub dark – zastąp to hookiem jeśli masz
  		onWidgetAction={async () => {}} // placeholder
  		onResponseEnd={() => {}}
  		onThemeRequest={() => {}}
	/>

      </div>
    </main>
  );
}
