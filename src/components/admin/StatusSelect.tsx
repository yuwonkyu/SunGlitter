import { memo } from "react";
import type { ReservationStatus } from "@/types/schedule";

const STATUS_OPTIONS: { label: string; value: ReservationStatus }[] = [
  { label: "예약 가능", value: "available" },
  { label: "대기", value: "pending" },
  { label: "예약 완료", value: "booked" },
];

interface StatusSelectProps {
  value: ReservationStatus;
  onChange: (status: ReservationStatus) => void;
}

/**
 * 예약 상태 선택 드롭다운 컴포넌트
 */
const StatusSelect = memo(({ value, onChange }: StatusSelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ReservationStatus)}
      className="w-full cursor-pointer rounded-md border border-zinc-400 bg-white px-3 py-2 text-sm"
      aria-label="예약 상태"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

StatusSelect.displayName = "StatusSelect";

export default StatusSelect;
