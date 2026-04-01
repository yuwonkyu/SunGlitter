import { memo } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ScheduleItem } from "@/types/schedule";

const formatUpdatedAt = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "기록 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
};

interface SlotCardProps {
  item: ScheduleItem;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

/**
 * 관리자 페이지에서 예약 슬롯 하나를 표시하는 카드. 수정/삭제 버튼 포함.
 */
const SlotCard = memo(({ item, onEdit, onDelete }: SlotCardProps) => (
  <article className="rounded-lg border border-zinc-300 bg-white p-3">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">{item.time}</p>
        <p className="mt-1 text-sm text-zinc-700">{item.guestName}</p>
        <p className="mt-1 text-xs text-zinc-500">
          최종 작업: {formatUpdatedAt(item.updatedAt)}
        </p>
      </div>
      <StatusBadge status={item.status} variant="full" />
    </div>

    {item.note ? (
      <p className="mt-2 text-xs text-zinc-500">{item.note}</p>
    ) : null}

    <div className="mt-3 flex gap-3 text-xs">
      <button
        onClick={() => onEdit(item)}
        className="underline"
        type="button"
        aria-label="예약 슬롯 수정"
      >
        수정
      </button>
      <button
        onClick={() => onDelete(item.id)}
        className="underline text-zinc-700"
        type="button"
        aria-label="예약 슬롯 삭제"
      >
        삭제
      </button>
    </div>
  </article>
));

SlotCard.displayName = "SlotCard";

export default SlotCard;
