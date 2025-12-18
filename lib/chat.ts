export type ChatTopic = "general" | "grants";

export function isChatTopic(value: string): value is ChatTopic {
  return value === "general" || value === "grants";
}

export function workflowIdForTopic(topic: ChatTopic): string {
  if (topic === "general") {
    const id = process.env.WORKFLOW_GENERAL_ID;
    if (!id) throw new Error("Missing WORKFLOW_GENERAL_ID");
    return id;
  }

  const id = process.env.WORKFLOW_GRANTS_ID;
  if (!id) throw new Error("Missing WORKFLOW_GRANTS_ID");
  return id;
}
