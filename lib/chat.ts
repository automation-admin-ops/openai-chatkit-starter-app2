export type ChatTopic = "general" | "grants";

export function normalizeTopic(topic: string): ChatTopic {
  return topic === "grants" ? "grants" : "general";
}
