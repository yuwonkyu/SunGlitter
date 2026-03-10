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

export const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

const pad = (value: number) => String(value).padStart(2, "0");

export const toDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const toMonthLabel = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

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

export const groupItemsByDate = (items: ScheduleItem[]) => {
  return items.reduce<Record<string, ScheduleItem[]>>((acc, item) => {
    acc[item.date] = [...(acc[item.date] ?? []), item].sort((a, b) =>
      a.time.localeCompare(b.time),
    );
    return acc;
  }, {});
};

export const getDaySummary = (items: ScheduleItem[]) => {
  return {
    total: items.length,
    available: items.filter((item) => item.status === "available").length,
    pending: items.filter((item) => item.status === "pending").length,
    booked: items.filter((item) => item.status === "booked").length,
  };
};
