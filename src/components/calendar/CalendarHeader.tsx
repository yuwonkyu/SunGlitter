import { memo } from "react";
import Image from "next/image";
import { toMonthLabel } from "@/lib/calendar";

interface CalendarHeaderProps {
  viewMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

/**
 * 달력 월 네비게이션 헤더
 */
const CalendarHeader = memo(
  ({ viewMonth, onPrevMonth, onNextMonth }: CalendarHeaderProps) => {
    return (
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm"
          aria-label="이전 달"
        >
          <Image src="/left.svg" alt="이전" width={16} height={16} />
        </button>
        <span className="text-sm font-semibold">{toMonthLabel(viewMonth)}</span>
        <button
          onClick={onNextMonth}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm"
          aria-label="다음 달"
        >
          <Image src="/right.svg" alt="다음" width={16} height={16} />
        </button>
      </div>
    );
  },
);

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;
