"use client";

import {
  ChatKitProvider,
  ChatKitChat,
} from "@openai/chatkit-react";

export default function ChatKitPanel({
  clientSecret,
}: {
  clientSecret: string;
}) {
  return (
    <ChatKitProvider clientSecret={clientSecret}>
      <ChatKitChat />
    </ChatKitProvider>
  );
}
