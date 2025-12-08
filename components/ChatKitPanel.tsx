'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';

type Props = {
  clientSecret: string;
};

export default function ChatKitPanel({ clientSecret }: Props) {
  const { control } = useChatKit({
    api: {
      getClientSecret: async () => clientSecret
    }
  });

  return <ChatKit control={control} className="w-full h-full" />;
}
