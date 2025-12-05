"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  const chats = [
    { id: "dofinansowania", label: "Dofinansowania", emoji: "💸", color: "from-emerald-400 to-green-500" },
    { id: "ogolny", label: "Chat Ogólny", emoji: "💬", color: "from-purple-400 to-pink-500" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-3xl font-extrabold mb-12 drop-shadow-lg text-gray-800 dark:text-white">
        Wybierz swojego asystenta 🤖✨
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-10">
        {chats.map(chat => (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            key={chat.id}
            onClick={() => router.push(`/chat/${chat.id}`)}
            className={`relative h-36 w-36 rounded-full flex flex-col items-center justify-center
            bg-gradient-to-br ${chat.color} text-white shadow-xl font-bold text-lg hover:shadow-2xl
            active:scale-95 transition-all drop-shadow-lg`}
          >
            <span className="text-4xl">{chat.emoji}</span>
            <span className="mt-2">{chat.label}</span>
          </motion.button>
        ))}
      </div>
    </main>
  );
}
