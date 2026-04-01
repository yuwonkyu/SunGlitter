import { memo } from "react";
import { weekdayLabels } from "@/lib/calendar";

interface WeekdayHeaderProps {
  className?: string;
  labelClassName?: string;
}

const WeekdayHeader = memo(({ className, labelClassName }: WeekdayHeaderProps) => {
  const wrapperClassName = className ?? "mb-1 grid grid-cols-7 text-center";
  const itemClassName = labelClassName ?? "py-1 text-[11px] font-medium text-zinc-500";

  return (
    <div className={wrapperClassName}>
      {weekdayLabels.map((label) => (
        <div key={label} className={itemClassName}>
          {label}
        </div>
      ))}
    </div>
  );
});

WeekdayHeader.displayName = "WeekdayHeader";

export default WeekdayHeader;
