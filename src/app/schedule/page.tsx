"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReservationStatus, ScheduleItem } from "@/types/schedule";

const statusLabel: Record<ReservationStatus, string> = {
  available: "예약 가능",
  pending: "대기",
  booked: "예약 완료",
};

const statusClass: Record<ReservationStatus, string> = {
  available: "bg-white text-zinc-900 border-zinc-400",
  pending: "bg-zinc-100 text-zinc-800 border-zinc-500",
  booked: "bg-zinc-900 text-zinc-100 border-zinc-900",
};

export default function SchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const grouped = useMemo(() => {
    return items.reduce<Record<string, ScheduleItem[]>>((acc, item) => {
      acc[item.date] = [...(acc[item.date] ?? []), item];
      return acc;
    }, {});
  }, [items]);

  return (
    <div className="paper-bg min-h-screen px-5 py-8">
      <main className="mx-auto w-full max-w-md">
        <header className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-bold">예약 현황</h1>
          <p className="mt-2 text-sm text-zinc-600">
            현재 공유된 스케줄 상태입니다.
          </p>
        </header>

        {loading ? (
          <p className="mt-4 text-sm text-zinc-600">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="mt-4 rounded-xl border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700">
            아직 등록된 예약 현황이 없습니다.
          </p>
        ) : (
          <section className="mt-4 space-y-4">
            {Object.entries(grouped).map(([date, dateItems]) => (
              <article
                key={date}
                className="rounded-xl border border-zinc-300 bg-zinc-50 p-4"
              >
                <h2 className="text-sm font-semibold">{date}</h2>
                <ul className="mt-3 space-y-2">
                  {dateItems.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-zinc-300 bg-white p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{item.time}</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs ${statusClass[item.status]}`}
                        >
                          {statusLabel[item.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-700">
                        {item.guestName}
                      </p>
                      {item.note ? (
                        <p className="mt-1 text-xs text-zinc-500">
                          {item.note}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/" className="underline underline-offset-4 text-zinc-700">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
