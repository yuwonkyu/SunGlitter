import { memo } from "react";
import Image from "next/image";
import { toMonthLabel } from "@/lib/calendar";

interface CalendarHeaderProps {
  viewMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  className?: string;
  buttonClassName?: string;
  titleClassName?: string;
  useArrowIcon?: boolean;
  prevText?: string;
  nextText?: string;
}

/**
 * 달력 월 네비게이션 헤더
 */
const CalendarHeader = memo(
  ({
    viewMonth,
    onPrevMonth,
    onNextMonth,
    className,
    buttonClassName,
    titleClassName,
    useArrowIcon = true,
    prevText = "이전",
    nextText = "다음",
  }: CalendarHeaderProps) => {
    const wrapperClassName = className ?? "mb-3 flex items-center justify-between";
    const navButtonClassName =
      buttonClassName ??
      "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm";
    const monthTitleClassName = titleClassName ?? "text-sm font-semibold";

    return (
      <div className={wrapperClassName}>
        <button
          type="button"
          onClick={onPrevMonth}
          className={navButtonClassName}
          aria-label="이전 달"
        >
          {useArrowIcon ? (
            <Image src="/left.svg" alt={prevText} width={6} height={6} />
          ) : (
            prevText
          )}
        </button>
        <span className={monthTitleClassName}>{toMonthLabel(viewMonth)}</span>
        <button
          type="button"
          onClick={onNextMonth}
          className={navButtonClassName}
          aria-label="다음 달"
        >
          {useArrowIcon ? (
            <Image src="/right.svg" alt={nextText} width={6} height={6} />
          ) : (
            nextText
          )}
        </button>
      </div>
    );
  },
);

CalendarHeader.displayName = "CalendarHeader";

export default CalendarHeader;
