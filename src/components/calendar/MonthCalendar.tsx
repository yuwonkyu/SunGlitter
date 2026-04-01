"use client";

import { memo, useCallback, useMemo, useState } from "react";
import {
  createMonthGrid,
  statusTone,
  toDateKey,
  toMonthLabel,
  weekdayLabels,
} from "@/lib/calendar";
import { maskName } from "@/lib/utils";
import type { ScheduleItem } from "@/types/schedule";

interface MonthCalendarProps {
  /** groupItemsByDate() 로 만든 날짜별 슬롯 맵 */
  grouped: Record<string, ScheduleItem[]>;
}

/**
 * 날짜 셀 컴포넌트
 */
const DateCell = memo(
  ({
    date,
    isCurrentMonth,
    isToday,
    dayItems,
    onPreview,
  }: {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    dayItems: ScheduleItem[];
    onPreview: (item: ScheduleItem) => void;
  }) => {
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
      {/* 월 네비게이션 */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm"
          aria-label="이전 달"
        >
          ‹
        </button>
        <span className="text-sm font-semibold">{toMonthLabel(viewMonth)}</span>
        <button
          onClick={nextMonth}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

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

      {/* 범례 */}
      <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
        <span className="rounded border border-zinc-400 bg-white px-1.5 py-0.5 text-zinc-900">
          예약 가능
        </span>
        <span className="rounded border border-zinc-400 bg-zinc-200 px-1.5 py-0.5 text-zinc-800">
          대기
        </span>
        <span className="rounded border border-zinc-900 bg-zinc-900 px-1.5 py-0.5 text-zinc-100">
          예약 완료
        </span>
      </div>

      {previewItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
          aria-label="예약 내역 미리보기"
        >
          <div
            className="w-full max-w-xs rounded-xl border border-zinc-300 bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">예약 내역</h3>
              <button
                type="button"
                onClick={closePreview}
                className="rounded px-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="mr-2 text-zinc-500">예약자</span>
                <span className="font-medium text-zinc-900">
                  {maskName(previewItem.guestName)}
                </span>
              </p>
              <p>
                <span className="mr-2 text-zinc-500">예약시간</span>
                <span className="font-medium text-zinc-900">{previewItem.time}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
});

MonthCalendar.displayName = "MonthCalendar";

export default MonthCalendar;
