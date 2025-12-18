export type ChatTopic = "general" | "grants";

export function workflowIdForTopic(topic: ChatTopic): string {
  switch (topic) {
    case "general": {
      const id = process.env.WORKFLOW_GENERAL_ID;
      if (!id) {
        throw new Error("WORKFLOW_GENERAL_ID is not set");
      }
      return id;
    }

    case "grants": {
      const id = process.env.WORKFLOW_GRANTS_ID;
      if (!id) {
        throw new Error("WORKFLOW_GRANTS_ID is not set");
      }
      return id;
    }

    default:
      throw new Error(`Unknown chat topic: ${topic}`);
  }
}
