"use client";

import { memo, useCallback, useMemo, useState } from "react";
import {
  createMonthGrid,
  toDateKey,
  weekdayLabels,
} from "@/lib/calendar";
import type { ScheduleItem } from "@/types/schedule";
import DateCell from "./DateCell";
import ItemPreviewModal from "./ItemPreviewModal";
import CalendarLegend from "./CalendarLegend";
import CalendarHeader from "./CalendarHeader";

interface MonthCalendarProps {
  /** groupItemsByDate() 로 만든 날짜별 슬롯 맵 */
  grouped: Record<string, ScheduleItem[]>;
}

/**
 * 월별 달력 그리드. 각 날짜 셀에 예약 슬롯(시간 + 마스킹된 이름)을 표시합니다.
 */
const MonthCalendar = memo(({ grouped }: MonthCalendarProps) => {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [previewItem, setPreviewItem] = useState<ScheduleItem | null>(null);

  const grid = useMemo(() => createMonthGrid(viewMonth), [viewMonth]);
  const todayKey = useMemo(
    () => toDateKey(new Date()),
    [], // 의도적으로 deps를 비워서 마운트 시점의 오늘 날짜로 고정
  );

  const prevMonth = useCallback(
    () => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)),
    [],
  );
  const nextMonth = useCallback(
    () => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)),
    [],
  );
  const openPreview = useCallback((item: ScheduleItem) => {
    setPreviewItem(item);
  }, []);
  const closePreview = useCallback(() => {
    setPreviewItem(null);
  }, []);

  return (
    <section className="rounded-2xl border border-zinc-300 bg-zinc-50 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
      <CalendarHeader
        viewMonth={viewMonth}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      {/* 요일 헤더 */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="py-1 text-[11px] font-medium text-zinc-500"
          >
            {label}
          </div>
        ))}
      </div>

      {/* 날짜 셀 그리드 */}
      <div className="grid grid-cols-7 gap-px bg-zinc-200">
        {grid.map(({ key, date, isCurrentMonth }) => {
          const dayItems = grouped[key] ?? [];
          const isToday = key === todayKey;
          return (
            <DateCell
              key={key}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              dayItems={dayItems}
              onPreview={openPreview}
            />
          );
        })}
      </div>

      <CalendarLegend />

      <ItemPreviewModal item={previewItem} onClose={closePreview} />
    </section>
  );
});

MonthCalendar.displayName = "MonthCalendar";

export default MonthCalendar;
