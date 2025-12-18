import Redis from "ioredis";

let client: Redis | null = null;

export function redis() {
  if (!client) {
    if (!process.env.REDIS_URL) {
      throw new Error("Missing REDIS_URL");
    }
    client = new Redis(process.env.REDIS_URL);
  }
  return client;
}
