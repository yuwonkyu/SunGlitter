import type { ReservationStatus, ScheduleItem } from "@/types/schedule";

export const statusLabel: Record<ReservationStatus, string> = {
  available: "예약 가능",
  pending: "대기",
  booked: "예약 완료",
};

export const statusTone: Record<ReservationStatus, string> = {
  available: "border-zinc-400 bg-white text-zinc-900",
  pending: "border-zinc-400 bg-zinc-200 text-zinc-800",
  booked: "border-zinc-900 bg-zinc-900 text-zinc-100",
};

export const weekdayLabels = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
] as const;

/**
 * 숫자를 2자리 문자열로 변환 (0-9 → 00-09)
 */
const pad = (value: number): string => String(value).padStart(2, "0");

/**
 * Date를 YYYY-MM-DD 형식의 키로 변환
 */
export const toDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * Date를 "YYYY년 M월" 형식의 레이블로 변환
 */
export const toMonthLabel = (date: Date): string => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

/**
 * 주어진 달의 6주 42일 달력 그리드 생성
 */
export const createMonthGrid = (baseDate: Date) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);

    return {
      date: cellDate,
      key: toDateKey(cellDate),
      isCurrentMonth: cellDate.getMonth() === month,
    };
  });
};

/**
 * 예약 아이템 배열을 날짜별로 그룹화하고 시간순 정렬
 */
export const groupItemsByDate = (items: ScheduleItem[]) => {
  return items.reduce<Record<string, ScheduleItem[]>>((acc, item) => {
    const dateItems = acc[item.date] ?? [];
    dateItems.push(item);
    dateItems.sort((a, b) => a.time.localeCompare(b.time));
    acc[item.date] = dateItems;
    return acc;
  }, {});
};

/**
 * 전체 슬롯 수, available, pending, booked 수 계산
 */
export const getDaySummary = (items: ScheduleItem[]) => ({
  total: items.length,
  available: items.filter((item) => item.status === "available").length,
  pending: items.filter((item) => item.status === "pending").length,
  booked: items.filter((item) => item.status === "booked").length,
});
