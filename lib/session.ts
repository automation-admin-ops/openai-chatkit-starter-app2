import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export function getSessionId() {
  const store = cookies();
  const existing = store.get("sid")?.value;

  if (existing) return existing;

  const sid = nanoid();
  store.set("sid", sid, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  return sid;
}
