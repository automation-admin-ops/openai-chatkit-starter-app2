import { createClient } from "redis";

declare global {
  // eslint-disable-next-line no-var
  var redisClient: ReturnType<typeof createClient> | undefined;
}

export const redis =
  global.redisClient ??
  createClient({
    url: process.env.REDIS_URL,
  });

if (!redis.isOpen) {
  await redis.connect();
}

if (process.env.NODE_ENV !== "production") {
  global.redisClient = redis;
}
