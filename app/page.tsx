import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center gap-6">
      <Link
        href="/chat/general"
        className="px-6 py-4 rounded bg-black text-white"
      >
        Chat ogólny
      </Link>

      <Link
        href="/chat/grants"
        className="px-6 py-4 rounded bg-blue-600 text-white"
      >
        Dofinansowania
      </Link>
    </main>
  );
}
