'use client';

import ChatKitPanel from '@/components/ChatKitPanel';
import { useSearchParams } from 'next/navigation';

export default function ChatPage() {
  const params = useSearchParams();
  const clientSecret = params.get('secret');

  if (!clientSecret) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-medium">
          ❌ Brak `secret` w URL. Nie można uruchomić czatu.
        </p>
      </main>
    );
  }

  return (
    <div className="h-screen w-screen">
      <ChatKitPanel clientSecret={clientSecret} />
    </div>
  );
}
