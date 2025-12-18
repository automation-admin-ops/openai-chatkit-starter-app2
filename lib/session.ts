import { cookies } from "next/headers";

export async function getSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get("sid")?.value;

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  store.set("sid", id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return id;
}
