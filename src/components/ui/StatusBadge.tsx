import { statusLabel, statusTone } from "@/lib/calendar";
import type { ReservationStatus } from "@/types/schedule";

interface StatusBadgeProps {
  status: ReservationStatus;
  /** "full" = pill 형태, "sm" = 작은 사각형 뱃지 */
  variant?: "full" | "sm";
}

/**
 * 예약 상태를 나타내는 배지 컴포넌트.
 */
export default function StatusBadge({
  status,
  variant = "full",
}: StatusBadgeProps) {
  const shape =
    variant === "full"
      ? "rounded-full border px-2 py-1 text-xs"
      : "rounded border px-1 py-0.5 text-[10px] leading-tight";

  return (
    <span className={`${shape} ${statusTone[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
