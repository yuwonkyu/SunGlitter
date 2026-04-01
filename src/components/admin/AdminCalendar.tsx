import { memo, useEffect, useMemo, useState } from "react";
import { createMonthGrid, fromDateKey, toDateKey } from "@/lib/calendar";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import WeekdayHeader from "@/components/calendar/WeekdayHeader";

interface AdminCalendarProps {
  selectedDate: string | null;
  registeredDateCounts: Record<string, number>;
  onDateChange: (dateKey: string) => void;
}

/**
 * 관리자 페이지의 독립형 캘린더 컴포넌트.
 */
const AdminCalendar = memo(
  ({ selectedDate, registeredDateCounts, onDateChange }: AdminCalendarProps) => {
    const [viewMonth, setViewMonth] = useState(() => {
      const selected = selectedDate ? fromDateKey(selectedDate) : null;
      const source = selected ?? new Date();
      return new Date(source.getFullYear(), source.getMonth(), 1);
    });

    const grid = useMemo(() => createMonthGrid(viewMonth), [viewMonth]);
    const todayKey = useMemo(() => toDateKey(new Date()), []);

    useEffect(() => {
      if (!selectedDate) {
        return;
      }
      const selected = fromDateKey(selectedDate);
      if (!selected) {
        return;
      }
      const nextViewMonth = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      );
      queueMicrotask(() => setViewMonth(nextViewMonth));
    }, [selectedDate]);

    const prevMonth = () => {
      setViewMonth(
        (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
      );
    };
    const nextMonth = () => {
      setViewMonth(
        (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
      );
    };

    return (
      <section className="space-y-3  p-4">
        <p className="text-sm font-semibold text-zinc-900">
          날짜 선택
        </p>

        <div className="  bg-white rounded-2xl p-3">
          <CalendarHeader
            viewMonth={viewMonth}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            buttonClassName="rounded-md border border-zinc-300 px-2 py-1 text-xs"
            titleClassName="text-sm font-semibold text-zinc-800"
          />

          <WeekdayHeader
            className="mb-1 grid grid-cols-7 text-center text-[11px] text-zinc-500"
            labelClassName="py-1"
          />

          <div className="grid grid-cols-7 gap-1">
            {grid.map(({ key, date, isCurrentMonth }) => {
              const isSelected = selectedDate === key;
              const isToday = key === todayKey;
              const reservationCount = registeredDateCounts[key] ?? 0;

              const reservationToneClassName =
                reservationCount >= 5
                  ? "border-red-500/30 bg-red-200/50"
                  : reservationCount >= 3
                    ? "border-orange-500/30 bg-orange-200/50"
                    : reservationCount >= 1
                      ? "border-lime-500/30 bg-lime-300/45"
                      : "bg-zinc-50";

              const cellClassName = [
                "h-9 rounded-md border text-xs transition",
                isCurrentMonth
                  ? "text-zinc-800"
                  : "border-transparent text-zinc-400",
                reservationToneClassName,
                isSelected ? "ring-2 ring-emerald-500" : "",
                isToday ? "font-semibold" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={key}
                  type="button"
                  className={cellClassName}
                  onClick={() => onDateChange(key)}
                  aria-label={`${key} 날짜 선택`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-zinc-600">
            연두색: 1~2건, 연한 주황: 3~4건, 연한 빨강: 5건 이상
          </p>
        </div>
      </section>
    );
  }
);

AdminCalendar.displayName = "AdminCalendar";

export default AdminCalendar;
