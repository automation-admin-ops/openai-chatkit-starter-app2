'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useSearchParams } from 'next/navigation';

export default function ChatPage() {
  const params = useSearchParams();
  const clientSecret = params.get('secret');

  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        if (!clientSecret) {
          throw new Error('Brak client_secret w URL');
        }
        return clientSecret;
      }
    }
  });

  if (!clientSecret) {
    return <p>❌ Brak parametru `secret` w URL.</p>;
  }

  return (
    <div className="h-screen">
      <ChatKit control={control} className="h-full w-full" />
    </div>
  );
}
