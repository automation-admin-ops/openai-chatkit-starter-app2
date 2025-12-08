'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useSearchParams } from 'next/navigation';

export default function ChatPage() {
  const params = useSearchParams();
  const clientSecret = params.get('secret');

  const { control } = useChatKit({
    clientSecret: clientSecret || undefined,
    api: {
      getClientSecret: async () => {
        const res = await fetch('/api/create-session', { method: 'POST' });
        const data = await res.json();
        return data.client_secret;
      }
    }
  });

  if (!clientSecret) return <p>❌ Brak parametru `secret` w URL.</p>;

  return (
    <div className="h-screen">
      <ChatKit control={control} className="h-full w-full" />
    </div>
  );
}
