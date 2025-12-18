export type ChatTopic = "general" | "dofinansowania";

export function workflowIdForTopic(topic: ChatTopic) {
  switch (topic) {
    case "general":
      return process.env.OPENAI_WORKFLOW_GENERAL!;
    case "dofinansowania":
      return process.env.OPENAI_WORKFLOW_DOFINANSOWANIA!;
  }
}
