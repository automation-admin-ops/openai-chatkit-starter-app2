import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Wybierz chat</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/chat/general"
          className="rounded-xl border p-5 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <h2 className="text-lg font-medium">Chat ogólny</h2>
          <p className="text-sm opacity-80">
            Ogólne pytania i rozmowy
          </p>
        </Link>

        <Link
          href="/chat/grants"
          className="rounded-xl border p-5 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <h2 className="text-lg font-medium">Dofinansowania</h2>
          <p className="text-sm opacity-80">
            Osobny agent + osobna historia
          </p>
        </Link>
      </div>
    </main>
  );
}
