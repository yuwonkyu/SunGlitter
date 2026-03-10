import { Redis } from "@upstash/redis";
import type { ScheduleItem } from "@/types/schedule";

const STORAGE_KEY = "yoonseul:schedule:items";

let memoryStore: ScheduleItem[] = [];

const getRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({
    url,
    token,
  });
};

const sortItems = (items: ScheduleItem[]) => {
  return [...items].sort((a, b) => {
    const aKey = `${a.date}T${a.time}`;
    const bKey = `${b.date}T${b.time}`;
    return aKey.localeCompare(bKey);
  });
};

export const getScheduleItems = async () => {
  const redis = getRedisClient();
  if (!redis) {
    return sortItems(memoryStore);
  }

  const items = (await redis.get<ScheduleItem[]>(STORAGE_KEY)) ?? [];
  return sortItems(items);
};

export const saveScheduleItems = async (items: ScheduleItem[]) => {
  const normalized = sortItems(items);
  const redis = getRedisClient();

  if (!redis) {
    memoryStore = normalized;
    return normalized;
  }

  await redis.set(STORAGE_KEY, normalized);
  return normalized;
};
