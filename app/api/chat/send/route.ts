import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const { chatType, message } = await req.json();

  if (!message || !chatType) {
    return NextResponse.json(
      { error: "Brak chatType lub message" },
      { status: 400 }
    );
  }

  const chatKey =
    chatType === "grants"
      ? "chat:grants"
      : "chat:general";

  // 1️⃣ pobierz historię
  const raw = await redis.get(chatKey);
  const history = raw ? JSON.parse(raw) : [];

  // 2️⃣ zapisz wiadomość użytkownika
  history.push({
    role: "user",
    content: message,
    ts: Date.now(),
  });

  // 3️⃣ WYWOŁANIE AGENTA
  // ⬇️ TU MASZ DWA WYJŚCIA:
  // A) jeśli frontend dalej gada z ChatKit → NIE wołasz agenta tutaj
  // B) jeśli chcesz pełną kontrolę → wołasz OpenAI API TU

  // NA TEN MOMENT: tylko zapis historii
  // (agent dalej odpowiada po stronie frontu)

  await redis.set(chatKey, JSON.stringify(history));

  return NextResponse.json({ ok: true });
}
