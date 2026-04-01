import { memo } from "react";

/**
 * 달력 범례 컴포넌트
 */
const CalendarLegend = memo(() => {
  return (
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
  );
});

CalendarLegend.displayName = "CalendarLegend";

export default CalendarLegend;
