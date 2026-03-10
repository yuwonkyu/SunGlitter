"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createMonthGrid,
  groupItemsByDate,
  statusTone,
  toDateKey,
  toMonthLabel,
  weekdayLabels,
} from "@/lib/calendar";
import type { ScheduleItem } from "@/types/schedule";

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/schedule", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as ScheduleItem[];
          setItems(data);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchItems();
  }, []);

  const grouped = useMemo(() => groupItemsByDate(items), [items]);
  const grid = useMemo(() => createMonthGrid(viewMonth), [viewMonth]);
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const prevMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="paper-bg min-h-screen px-5 py-8">
      <main className="mx-auto w-full max-w-md space-y-4">
        <header className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-bold">예약 현황</h1>
          <p className="mt-2 text-sm text-zinc-600">
            달력에서 날짜별 예약 현황을 확인할 수 있습니다.
          </p>
        </header>

        {loading ? (
          <p className="mt-4 text-sm text-zinc-600">불러오는 중...</p>
        ) : (
          <section className="rounded-2xl border border-zinc-300 bg-zinc-50 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm"
              >
                ‹
              </button>
              <span className="text-sm font-semibold">
                {toMonthLabel(viewMonth)}
              </span>
              <button
                onClick={nextMonth}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm"
              >
                ›
              </button>
            </div>

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

            <div className="grid grid-cols-7 gap-px bg-zinc-200">
              {grid.map(({ key, date, isCurrentMonth }) => {
                const dayItems = grouped[key] ?? [];
                const isToday = key === todayKey;
                return (
                  <div
                    key={key}
                    className={`min-h-15 bg-zinc-50 p-1 ${
                      !isCurrentMonth ? "opacity-30" : ""
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium ${
                        isToday ? "bg-zinc-900 text-white" : "text-zinc-700"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayItems.map((item) => {
                        const name = item.guestName;
                        const maskedName =
                          name.length >= 2
                            ? name[0] + "*" + name.slice(2)
                            : name;
                        return (
                          <div
                            key={item.id}
                            className={`rounded border px-1 py-0.5 text-[10px] leading-tight ${statusTone[item.status]}`}
                          >
                            <div>{item.time}</div>
                            <div className="truncate opacity-80">
                              {maskedName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

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
        )}

        <div className="text-center text-sm">
          <Link href="/" className="underline underline-offset-4 text-zinc-700">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
