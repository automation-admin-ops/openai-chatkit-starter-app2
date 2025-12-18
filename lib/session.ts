import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function getSessionId(): Promise<string> {
  const store = await cookies();

  const existing = store.get("sid")?.value;
  if (existing) return existing;

  const sid = randomUUID();
  store.set("sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 rok
  });

  return sid;
}
