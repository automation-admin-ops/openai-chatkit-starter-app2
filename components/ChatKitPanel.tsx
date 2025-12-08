"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";

export default function ChatKitPanel({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const { control } = useChatKit({
    api: {
      getClientSecret: async () => clientSecret,
    },
  });

  return <ChatKit control={control} className="h-full w-full" />;
}
