import { memo } from "react";
import { statusTone } from "@/lib/calendar";
import { maskName } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

interface DateCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayItems: ScheduleItem[];
  onPreview: (item: ScheduleItem) => void;
}

/**
 * 달력의 날짜 셀 컴포넌트
 */
const DateCell = memo(
  ({
    date,
    isCurrentMonth,
    isToday,
    dayItems,
    onPreview,
  }: DateCellProps) => {
    const day = date.getDay();
    const dayColorClass = isToday
      ? "bg-zinc-900 text-white"
      : day === 0
        ? "text-red-500"
        : day === 6
          ? "text-blue-500"
          : "text-zinc-700";

    return (
      <div
        className={`min-h-15 bg-zinc-50 p-1 ${!isCurrentMonth ? "opacity-30" : ""}`}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium ${dayColorClass}`}
        >
          {date.getDate()}
        </span>
        <div className="mt-0.5 space-y-0.5">
          {dayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onPreview(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPreview(item);
                }
              }}
              aria-label={`${maskName(item.guestName)} 예약 내역 미리보기`}
              className={`cursor-pointer rounded border px-1 py-0.5 text-[10px] leading-tight ${statusTone[item.status]}`}
            >
              <div>{item.time}</div>
              <div className="truncate opacity-80">
                {maskName(item.guestName)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

DateCell.displayName = "DateCell";

export default DateCell;
