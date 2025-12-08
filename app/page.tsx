'use client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleStartChat = async (workflowId: string) => {
    const res = await fetch('/api/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId })
    });

    const data = await res.json();
    if (data.client_secret) {
      router.push(`/chat?secret=${encodeURIComponent(data.client_secret)}`);
    } else {
      alert('Błąd: nie udało się utworzyć sesji.');
      console.error(data);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-3xl font-bold">Wybierz czat</h1>
      <div className="flex gap-6">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full"
          onClick={() =>
            handleStartChat(
              process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID_DOFINANSOWANIA!
            )
          }
        >
          💸 Dofinansowania
        </button>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-full"
          onClick={() =>
            handleStartChat(process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID_OGOLNY!)
          }
        >
          💬 Ogólny
        </button>
      </div>
    </main>
  );
}
