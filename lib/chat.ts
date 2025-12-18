export type ChatTopic = "general" | "grants";

export function workflowIdForTopic(topic: string): string {
  if (topic === "grants") {
    const id = process.env.WORKFLOW_GRANTS_ID;
    if (!id) {
      throw new Error("WORKFLOW_GRANTS_ID is not set");
    }
    return id;
  }

  // default = general
  const id = process.env.WORKFLOW_GENERAL_ID;
  if (!id) {
    throw new Error("WORKFLOW_GENERAL_ID is not set");
  }
  return id;
}
