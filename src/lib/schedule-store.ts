import { Redis } from "@upstash/redis";
import type { ScheduleItem } from "@/types/schedule";

const STORAGE_KEY = "yoonseul:schedule:items";

let memoryStore: ScheduleItem[] = [];

/**
 * Redis 클라이언트 인스턴스 획득 (환경변수 확인)
 */
const getRedisClient = (): Redis | null => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
};

/**
 * 예약 아이템을 날짜 + 시간 기준으로 정렬
 */
const sortItems = (items: ScheduleItem[]): ScheduleItem[] =>
  [...items].sort((a, b) => {
    const aKey = `${a.date}T${a.time}`;
    const bKey = `${b.date}T${b.time}`;
    return aKey.localeCompare(bKey);
  });

/**
 * 저장소에서 예약 아이템 조회
 */
export const getScheduleItems = async (): Promise<ScheduleItem[]> => {
  const redis = getRedisClient();
  if (!redis) {
    return sortItems(memoryStore);
  }

  const items = (await redis.get<ScheduleItem[]>(STORAGE_KEY)) ?? [];
  return sortItems(items);
};

/**
 * 예약 아이템 저장 (Redis 또는 메모리 저장소)
 */
export const saveScheduleItems = async (
  items: ScheduleItem[],
): Promise<ScheduleItem[]> => {
  const normalized = sortItems(items);
  const redis = getRedisClient();

  if (!redis) {
    memoryStore = normalized;
    return normalized;
  }

  await redis.set(STORAGE_KEY, normalized);
  return normalized;
};
