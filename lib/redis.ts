import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

export function redis() {
  if (!client) {
    if (!process.env.REDIS_URL) {
      throw new Error("Missing REDIS_URL");
    }

    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    // UWAGA: w App Router musimy jawnie połączyć
    if (!client.isOpen) {
      client.connect();
    }
  }

  return client;
}
