"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Wybierz rodzaj asystenta
        </h1>

        <div className="flex gap-6">
        
          <Link
            href="/chat/dofinansowania"
            className="flex items-center justify-center w-40 h-40 rounded-full bg-green-500 text-white font-bold text-center shadow-lg hover:scale-105 transition-transform"
          >
            💰 Dofinansowania
          </Link>

          <Link
            href="/chat/ogolny"
            className="flex items-center justify-center w-40 h-40 rounded-full bg-blue-500 text-white font-bold text-center shadow-lg hover:scale-105 transition-transform"
          >
            💬 Ogólny
          </Link>

        </div>
      </div>
    </main>
  );
}
