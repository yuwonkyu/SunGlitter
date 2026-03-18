"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { groupItemsByDate } from "@/lib/calendar";
import type { ScheduleItem } from "@/types/schedule";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import BackLink from "@/components/ui/BackLink";
import MonthCalendar from "@/components/calendar/MonthCalendar";

const SchedulePage = () => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/schedule", { cache: "no-store" });
        if (res.ok) setItems((await res.json()) as ScheduleItem[]);
      } catch (error) {
        console.error("Failed to fetch schedule items:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchItems();
  }, []);

  // 날짜별 그룹화
  const grouped = useMemo(() => groupItemsByDate(items), [items]);

  return (
    <PageShell>
      <PageHeader
        title="예약 현황"
        description="달력에서 날짜별 예약 현황을 확인할 수 있습니다."
      />
      {loading ? (
        <p className="mt-4 text-sm text-zinc-600">불러오는 중...</p>
      ) : (
        <MonthCalendar grouped={grouped} />
      )}
      <BackLink />
    </PageShell>
  );
};

export default SchedulePage;
