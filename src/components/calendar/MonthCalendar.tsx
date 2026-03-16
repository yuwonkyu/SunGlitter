"use client";

import { useMemo, useState } from "react";
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
 * 월별 달력 그리드. 각 날짜 셀에 예약 슬롯(시간 + 마스킹된 이름)을 표시합니다.
 */
export default function MonthCalendar({ grouped }: MonthCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const grid = useMemo(() => createMonthGrid(viewMonth), [viewMonth]);
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const prevMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

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
            <div
              key={key}
              className={`min-h-15 bg-zinc-50 p-1 ${!isCurrentMonth ? "opacity-30" : ""}`}
            >
              {(() => {
                const day = date.getDay();
                let colorClass = "text-zinc-700";
                if (!isToday) {
                  if (day === 0) colorClass = "text-red-500"; // 일요일
                  else if (day === 6) colorClass = "text-blue-500"; // 토요일
                }
                return (
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium ${
                      isToday ? "bg-zinc-900 text-white" : colorClass
                    }`}
                  >
                    {date.getDate()}
                  </span>
                );
              })()}
              <div className="mt-0.5 space-y-0.5">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded border px-1 py-0.5 text-[10px] leading-tight ${statusTone[item.status]}`}
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
    </section>
  );
}
